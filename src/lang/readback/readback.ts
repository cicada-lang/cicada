import type { Core } from "../core"
import type { Ctx } from "../ctx"
import type { Mod } from "../mod"
import { readbackByType, readbackByValue } from "../readback"
import { solutionAdvanceValue } from "../solution"
import type { Value } from "../value"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `equivalent` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(mod: Mod, ctx: Ctx, type: Value, value: Value): Core {
  type = solutionAdvanceValue(mod, type)
  value = solutionAdvanceValue(mod, value)

  return (
    readbackByType(mod, ctx, type, value) ||
    readbackByValue(mod, ctx, type, value)
  )
}
