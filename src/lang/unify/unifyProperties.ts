import * as Actions from "../actions"
import type { Ctx } from "../ctx"
import type { Mod } from "../mod"
import { unify } from "../unify"
import type { Value } from "../value"
import * as Values from "../value"

export function unifyProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): void {
  while (clazz["@kind"] !== "ClazzNull") {
    if (clazz["@kind"] === "ClazzCons") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      clazz = Values.clazzClosureApply(clazz.restClosure, leftPropertyValue)
    }

    if (clazz["@kind"] === "ClazzFulfilled") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      clazz = clazz.rest
    }
  }
}
