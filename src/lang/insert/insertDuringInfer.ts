import type { Ctx } from "../ctx"
import type * as Exps from "../exp"
import { Inferred } from "../infer"
import { insertionApply, solveByArgs } from "../insert"
import type { Mod } from "../mod"

export function insertDuringInfer(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  const solved = solveByArgs(mod, ctx, inferred.type, args)

  let core = inferred.core

  for (const insertion of solved.insertions) {
    core = insertionApply(mod, ctx, insertion, core)
  }

  return Inferred(solved.type, core)
}
