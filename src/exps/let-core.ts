import { Core, AlphaCtx } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { evaluate } from "../core"

export class LetCore extends Core {
  name: string
  exp: Core
  ret: Core

  constructor(name: string, exp: Core, ret: Core) {
    super()
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  evaluate(env: Env): Value {
    const value = evaluate(env, this.exp)
    return evaluate(env.extend(this.name, value), this.ret)
  }

  repr(): string {
    return `let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `let ${this.name} = ${this.exp.alpha_repr(
      ctx
    )} ${this.ret.alpha_repr(ctx.extend(this.name))}`
  }
}
