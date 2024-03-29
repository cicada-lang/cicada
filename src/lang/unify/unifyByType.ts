import _ from "lodash"
import * as Actions from "../actions"
import { closureApply } from "../closure"
import type { Ctx } from "../ctx"
import { CtxCons, ctxNames } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { solutionNames } from "../solution"
import { unify, unifyProperties, unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
import * as Values from "../value"

export function unifyByType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  switch (type["@kind"]) {
    case "Type": {
      unifyType(mod, ctx, left, right)
      return "ok"
    }

    case "Trivial": {
      return "ok"
    }

    case "Pi": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRet = Actions.doAp(left, v)
      const rightRet = Actions.doAp(right, v)
      // NOTE Should not use `unify`, which will
      //   capture bound variables and make them out of scope.
      // unify(mod, ctx, retType, leftRet, rightRet)
      equivalent(mod, ctx, retType, leftRet, rightRet)
      return "ok"
    }

    case "PiImplicit": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRet = Actions.doApImplicit(left, v)
      const rightRet = Actions.doApImplicit(right, v)
      // NOTE Should not use `unify`, which will
      //   capture bound variables and make them out of scope.
      // unify(mod, ctx, retType, leftRet, rightRet)
      equivalent(mod, ctx, retType, leftRet, rightRet)
      return "ok"
    }

    case "Sigma": {
      const leftCar = Actions.doCar(left)
      const rightCar = Actions.doCar(right)
      unify(mod, ctx, type.carType, leftCar, rightCar)
      const car = Actions.doCar(left)
      const cdrType = closureApply(type.cdrTypeClosure, car)
      const leftCdr = Actions.doCdr(left)
      const rightCdr = Actions.doCdr(right)
      unify(mod, ctx, cdrType, leftCdr, rightCdr)
      // equivalent(mod, ctx, cdrType, leftCdr, rightCdr)
      return "ok"
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      assertNoExtraCommonProperties(type, left, right)
      unifyProperties(mod, ctx, type, left, right)
      return "ok"
    }
  }
}

function assertNoExtraCommonProperties(
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): void {
  if (left["@kind"] === "Objekt" && right["@kind"] === "Objekt") {
    const clazzNames = Values.clazzPropertyNames(clazz)
    const leftNames = Object.keys(left.properties)
    const rightNames = Object.keys(right.properties)
    const extraCommonNames = _.intersection(
      _.difference(leftNames, clazzNames),
      _.difference(rightNames, clazzNames),
    )

    if (extraCommonNames.length > 0) {
      throw new Errors.UnificationError(
        [
          `[unifyByType] on Clazz, expect no extra common names`,
          `  found: ${extraCommonNames.join(" ")}`,
        ].join("\n"),
      )
    }
  }
}
