import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class Zero extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  evaluate(env: Env): Value {
    return new Exps.ZeroValue()
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.NatValue(),
      core: new Exps.ZeroCore(),
    }
  }

  repr(): string {
    return "0"
  }
}
