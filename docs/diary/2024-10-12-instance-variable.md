---
title: instance variable
date: 2024-10-12
---


为了区分 instance variable，
要求 `self.name` 前缀，
并且以 `@name` 为缩写。

一旦要求 `self.name`，
在类型检查一个 class 的定义的过程中，
context 的 scope 的处理就简单多了。

# 例子

## Category

```cicada
class Category {
  Object: Type

  Morphism(dom: Object, cod: Object): Type

  id(x: Object): Morphism(x, x)

  compose(
    implicit x: Object,
    implicit y: Object,
    implicit z: Object,
    f: Morphism(x, y),
    g: Morphism(y, z),
  ): Morphism(x, z)

  idLeft(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y)
  ): Equal(Morphism(x, y), compose(id(x), f), f)

  idRight(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Equal(Morphism(x, y), compose(f, id(y)), f)

  composeAssociative(
    implicit x: Object,
    implicit y: Object,
    implicit z: Object,
    implicit w: Object,
    f: Morphism(x, y),
    g: Morphism(y, z),
    h: Morphism(z, w),
  ): Equal(
    Morphism(x, w),
    compose(f, compose(g, h)),
    compose(compose(f, g), h)
  )
}

class Category {
  Object: Type

  Morphism(dom: @Object, cod: @Object): Type

  id(x: @Object): @Morphism(x, x)

  compose(
    implicit x: @Object,
    implicit y: @Object,
    implicit z: @Object,
    f: @Morphism(x, y),
    g: @Morphism(y, z),
  ): @Morphism(x, z)

  idLeft(
    implicit x: @Object,
    implicit y: @Object,
    f: @Morphism(x, y)
  ): Equal(@Morphism(x, y), @compose(@id(x), f), f)

  idRight(
    implicit x: @Object,
    implicit y: @Object,
    f: @Morphism(x, y),
  ): Equal(@Morphism(x, y), @compose(f, @id(y)), f)

  composeAssociative(
    implicit x: @Object,
    implicit y: @Object,
    implicit z: @Object,
    implicit w: @Object,
    f: @Morphism(x, y),
    g: @Morphism(y, z),
    h: @Morphism(z, w),
  ): Equal(
    @Morphism(x, w),
    @compose(f, @compose(g, h)),
    @compose(@compose(f, g), h)
  )
}

class Category {
  Object: Type

  Morphism(dom: self.Object, cod: self.Object): Type

  id(x: self.Object): self.Morphism(x, x)

  compose(
    implicit x: self.Object,
    implicit y: self.Object,
    implicit z: self.Object,
    f: self.Morphism(x, y),
    g: self.Morphism(y, z),
  ): self.Morphism(x, z)

  idLeft(
    implicit x: self.Object,
    implicit y: self.Object,
    f: self.Morphism(x, y)
  ): Equal(self.Morphism(x, y), self.compose(self.id(x), f), f)

  idRight(
    implicit x: self.Object,
    implicit y: self.Object,
    f: self.Morphism(x, y),
  ): Equal(self.Morphism(x, y), self.compose(f, self.id(y)), f)

  composeAssociative(
    implicit x: self.Object,
    implicit y: self.Object,
    implicit z: self.Object,
    implicit w: self.Object,
    f: self.Morphism(x, y),
    g: self.Morphism(y, z),
    h: self.Morphism(z, w),
  ): Equal(
    self.Morphism(x, w),
    self.compose(f, self.compose(g, h)),
    self.compose(self.compose(f, g), h)
  )
}
```

## Epimorphism

```cicada
class Epimorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)

  cancelLeft(
    implicit x: cat.Object,
    implicit f: cat.Morphism(cod, x),
    implicit g: cat.Morphism(cod, x),
    Equal(
      cat.Morphism(dom, x),
      cat.compose(morphism, f),
      cat.compose(morphism, g)),
  ): Equal(cat.Morphism(cod, x), f, g)
}

class Epimorphism {
  cat: Category
  dom: @cat.Object
  cod: @cat.Object
  morphism: @cat.Morphism(@dom, @cod)

  cancelLeft(
    implicit x: @cat.Object,
    implicit f: @cat.Morphism(@cod, x),
    implicit g: @cat.Morphism(@cod, x),
    Equal(
      @cat.Morphism(@dom, x),
      @cat.compose(@morphism, f),
      @cat.compose(@morphism, g)),
  ): Equal(@cat.Morphism(@cod, x), f, g)
}

class Epimorphism {
  cat: Category
  dom: self.cat.Object
  cod: self.cat.Object
  morphism: self.cat.Morphism(self.dom, self.cod)

  cancelLeft(
    implicit x: self.cat.Object,
    implicit f: self.cat.Morphism(self.cod, x),
    implicit g: self.cat.Morphism(self.cod, x),
    Equal(
      self.cat.Morphism(self.dom, x),
      self.cat.compose(self.morphism, f),
      self.cat.compose(self.morphism, g)),
  ): Equal(self.cat.Morphism(self.cod, x), f, g)
}
```

# 不要 @ 缩写

也许就应该要 @ 缩写。

也许应该用 `this.name` & 而不是 `self.name`，
为了更接近 JavaScript。

但是其实不应该用 `this`，
因为 `self` 暗示了 self type 有关，
因此可以用 `Self` 代表 self type。
