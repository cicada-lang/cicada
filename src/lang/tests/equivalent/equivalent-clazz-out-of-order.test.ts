import { expect, test } from "vitest"
import { runCode } from "../utils"

test("equivalent Clazz -- out of order", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent Type {
    class { A: Type, B: Type, pair: Pair(A, B) }
  = class { A: Type, B: Type, pair: Pair(A, B) }
  = class { A: id(Type, Type), B: Type, pair: Pair(A, B) }
  = class { A: id(Type, Type), B: Type, pair: Pair(id(Type, A), id(Type, B)) }
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit Type,
      implicit class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
    ): Equal(
      Type,
      class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
      class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
    )"
  `)
})
