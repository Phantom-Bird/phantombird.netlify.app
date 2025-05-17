---
title: Vuepress Markdown 写作
---

## 文件头

```yaml
---
title: title
createTime: yyyy/mm/dd
categories:
    - category1
tags:
    - tag1
---
```

## 扩展语法

### 剧透

:::demo markdown
```md
!!剧透!!
```
:::

### 高亮

:::demo markdown
```md
==高亮==
```
:::

### 添加 HTML 属性

:::demo markdown
```md
red {#pp .a .b style="color:red"}

<!-- 在 demo 中必须空一行然后写点什么它才能工作。 -->
```
:::

:::tip
- 相当于 `id="pp" class="a b" style="color:red"`
:::

### 任务列表

:::demo markdown
```md
- [x] 1
- [ ] 2
```
:::

## 容器语法

### 容器嵌套

:::::demo markdown
```md
::::tip outer
:::tip inner
Hi
:::
::::
```
:::::

## 容器大全

### 普通容器

::::demo markdown
```md
:::tip 容器标题
支持：`important` `info` `note` `tip` `warning` `danger` `details`
:::
```
::::

### details 容器

::::demo markdown
```md
:::details
Hi
:::
```
::::

### 对齐

::::demo markdown
```md
:::center
center
:::
```
::::

### 分页

::::demo markdown
```md
::: tabs
@tab Hi
Hi
@tab Hello
Hello
:::
```
::::

### 分页（代码）

::::demo markdown
````md
::: code-tabs
@tab Ciao
```
Ciao
```
@tab Ciallo
```
Ciallo
```
:::
````
::::

### Markdown 演示

::::demo markdown
````md
```md
:::demo markdown
demo `demo` $demo$
:::
```
````
::::

## 字体

### 连字箭头与表情

::::demo markdown
```md
-> --> <==>  
:) :(
```
::::
