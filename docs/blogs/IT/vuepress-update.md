---
title: Vuepress 更新记
createTime: 2025/5/18
---

## Vuepress 更新

```sh
pnpm vp-update
```

### 图标错位

更新之后，图标出现了错位。经过检查，是图标错误地设置为了 `display:block` 导致。

于是改了 bug，顺便微调了下图标位置。!!微操大师：图标下移 2px！!!

```css
/*修复图标换行 bug*/

.vp-link .vp-icon {
    display: inline-block !important;
}

.vp-nav-screen-menu-group .button .button-text .vp-icon {
    display: inline-block !important;
}

/*微调导航栏图标*/

.vp-menu-link .vp-link .vp-icon {
    position: relative;
    top: 2px;
}

.vp-nav-screen-menu .vp-link .vp-icon {
    position: relative;
    top: 2px;
}

.navbar-menu-link .vp-icon {
    position: relative;
    top: 0.8px;
}
```

### demo

最大的破坏性更新在于老式的 demo 不能用了。现在只能用

````md
:::demo markdown
```md
Some Markdown here
```
:::
````

## MathJax

闲着没事干，把 KaTeX 换成了 MathJax.

> upd 5/30: 发现 KaTeX 可以设置 `copy` 和 `mhchem`，还能基线对齐，换回去了。还好 KaTeX 基本兼容 MathJax.

结果……

### 缓存坑

必须清缓存，不然你会见到数学公式百家争鸣。

```sh
pnpm docs:dev --clean-cache
```

### Erroneous nesting of equation structures

MathJax 对环境的要求更严格。诸如 `align*` 的环境是不能嵌套的。
不过，可以使用 `aligned` 进行内层嵌套。（当然，两层都用也不会报错）

### 不兼容

`\plusmn` 用不了，只能用 `\pm` 来表示 $\pm$

### inline or display

`$$` 默认单行模式？？？

:::demo markdown
```md
$$a\\b$$
---
$$\begin{gather*} a\\b \end{gather*}$$
---
$$\displaylines{a\\b}$$
```
:::

### 滚动条样式

```css
.MathJax {
    overflow: auto hidden;
    padding-top: .2em;
    padding-bottom: .4em;  /*KaTeX 默认的 .2em 在这里不够*/
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
}
```

### 宏包支持

在代码和文档的字缝里找了好久。

```ts
export default defineUserConfig({
    ...
    plugins: [
        ...,
        markdownMathPlugin({
            type: 'mathjax',
            tex: {
                packages: [...]
            }
        })
    ],
})
```
