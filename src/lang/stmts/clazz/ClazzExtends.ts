import * as Cores from "../../core"
import { evaluate } from "../../evaluate"
import type { Exp } from "../../exp"
import * as Exps from "../../exp"
import { infer } from "../../infer"
import type { Mod } from "../../mod"
import { readbackClazz } from "../../readback"
import type { Span } from "../../span"
import { Stmt } from "../../stmt"
import * as Values from "../../value"

export class ClazzExtends extends Stmt {
  constructor(
    public name: string,
    public parent: Exp,
    public clazz: Exps.ClazzUnfolded,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferredParent = infer(mod, mod.ctx, this.parent)
    const parentClazz = evaluate(mod.env, inferredParent.core)
    Values.assertClazzInCtx(mod, mod.ctx, parentClazz)
    const parentClazzCore = readbackClazz(mod, mod.ctx, parentClazz)
    const ctx = Values.clazzExtendCtx(mod, mod.ctx, parentClazz)
    const superObjekt = Exps.ObjektUnfolded(
      Values.clazzPropertyNames(parentClazz).map((name) =>
        Exps.PropertyPlain(name, Exps.Var(name)),
      ),
      this.span,
    )
    const clazz = Exps.substitute(this.clazz, "super", superObjekt)
    const inferred = infer(mod, ctx, clazz)
    Cores.assertClazz(inferred.core)
    const core = Cores.clazzAppend(parentClazzCore, inferred.core)
    core.name = this.name
    const value = evaluate(mod.env, core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
