# cicada

> 坚持设计类 JS 语法的语言：
> - 更贴近数学语言 f(x)。
> - 有自然的语法来表达 record，这对描述抽象数学结构而言尤为重要。

> Dance with expressions.
> - 不带 Value 的解释器，也许是 cicada 成功的关键，我必须认真探索它。

[cicada] 设计新的稳定的 Exp

[cicada] inference rules

- 当 everything is expression 时，
  inference rule 的表达会有什么变化？

  - 好像是所有论文中的 inference rule 都只会用 Exp，
    而不会用 Value 和 closure。

[cicada] 一个带有 dependent type 的实用语言。

- 编译到 xvm。

- 默认没有完备性检查，也没有停机检查。

  - 也许可以选择开启这些功能。

- 适合用来探索新的语言的解释器。
  比如 inet，逻辑式编程，
  explicit substitution，
  cell complex 的 higher algerbra，
  等等。

- 作为 dependent type 语言，
  就要在编译时带有一个解释器，
  这个解释器我们可以就尝试用
  explicit substitution 来实现。
  此时，我们不光要合并 Exp 以 Value，
  还需要合并 Exp 与 Core，
  经过 elab 所获得的 Core 也应该被囊括在 Exp 中。

- 如何把 data constructor 也处理为 Exp 而不是 Value？
  应该用 `T.C` 还是 `T::C` 作为构造数据的语法？

  - 我们还是需要 `T::C` 的，
    正如 `(lambda)` 是一个 Exp，
    通过名字引用 `(lambda)` 的时候，
    直接在查找到所对应的 Exp 就可以了
    （可能是在 mod 中，或在局部的环境中）。
    因此我们也需要一个特殊的 Exp 来表示 `T::C`，
    而不能给查找引入更复杂的机制，
    让变元的意义依赖于一个额外的参数（比如 mod）。
