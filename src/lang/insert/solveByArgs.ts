import { check } from "../check"
import { closureApply } from "../closure"
import type { Ctx } from "../ctx"
import { CtxFulfilled, ctxNames, ctxToEnv } from "../ctx"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import type * as Exps from "../exp"
import { freeNames } from "../exp"
import { inferOrUndefined } from "../infer"
import type { Insertion } from "../insert"
import type { Mod } from "../mod"
import { solutionNames } from "../solution"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
import * as Values from "../value"
import * as Insertions from "./Insertion"

export function solveByArgs(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
): {
  type: Value
  insertions: Array<Insertion>
} {
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const insertions: Array<Insertion> = []
  while (args.length > 0) {
    const [arg, ...restArgs] = args

    if (type["@kind"] === "PiImplicit" && arg["@kind"] === "ArgPlain") {
      // NOTE Be careful about scope bug, `freshName` might occurs in `args`.
      const name = type.retTypeClosure.name
      const usedNames = [
        ...ctxNames(ctx),
        ...solutionNames(mod.solution),
        ...argsFreeNames,
      ]
      const freshName = freshen(usedNames, name)
      const patternVar = Values.PatternVar(type.argType, freshName)
      ctx = CtxFulfilled(freshName, type.argType, patternVar, ctx)
      // NOTE Do not consume args here.
      type = closureApply(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionPatternVar(patternVar, arg.exp))
    } else if (type["@kind"] === "Pi" && arg["@kind"] === "ArgPlain") {
      const argInferred = inferOrUndefined(mod, ctx, arg.exp)
      if (
        argInferred !== undefined &&
        argInferred.type["@kind"] !== "PiImplicit"
      ) {
        unifyType(mod, ctx, argInferred.type, type.argType)
      }

      /**
         NOTE We can not use `argInserted.core` here,
         check against the given type is necessary.
      **/

      const argCore = check(mod, ctx, arg.exp, type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      type = closureApply(type.retTypeClosure, argValue)
      args = restArgs
      insertions.push(Insertions.InsertionUsedArg(argCore))
    } else if (
      type["@kind"] === "PiImplicit" &&
      arg["@kind"] === "ArgImplicit"
    ) {
      const argCore = check(mod, ctx, arg.exp, type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      type = closureApply(type.retTypeClosure, argValue)
      args = restArgs
      insertions.push(Insertions.InsertionImplicitArg(argCore))
    } else if (type["@kind"] === "Pi" && arg["@kind"] === "ArgImplicit") {
      throw new Errors.ElaborationError(
        [`[insertDuringInfer] extra Implicit argument`].join("\n"),
        { span: arg.exp.span },
      )
    } else {
      throw new Errors.ElaborationError(
        [
          `[insertDuringInfer] expect type to be Pi or PiImplicit`,
          `  given type "@kind": ${type["@kind"]}`,
        ].join("\n"),
        { span: arg.exp.span },
      )
    }
  }

  return { type, insertions }
}
