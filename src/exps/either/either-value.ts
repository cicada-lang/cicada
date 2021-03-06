import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class EitherValue extends Value {
  left_t: Value
  right_t: Value

  constructor(left_t: Value, right_t: Value) {
    super()
    this.left_t = left_t
    this.right_t = right_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.EitherCore(
        readback(ctx, new Exps.TypeValue(), this.left_t),
        readback(ctx, new Exps.TypeValue(), this.right_t)
      )
    }
  }
}
