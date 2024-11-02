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
:::md-demo 点击查看 Markdown
!!剧透!!
:::

### 高亮
:::md-demo 点击查看 Markdown
==高亮==
:::

### 添加 HTML 属性
:::md-demo 点击查看 Markdown
red {#pp .a .b style="color:red"}

在 demo 中必须空一行然后写点什么它才能工作。
:::

:::tip
- 相当于 `id="pp" class="a b" style="color:red"`
:::

### 任务列表
- [x] 1
- [x] 2

## 容器语法
### 容器嵌套
:::::md-demo 点击查看 Markdown
::::tip outer
:::tip inner
Hi
:::
::::
:::::

## 容器大全
### 普通容器
::::md-demo 点击查看 Markdown
:::tip 容器标题
支持：`important` `info` `note` `tip` `warning` `danger` `details`
:::
::::

### details 容器
::::md-demo 点击查看 Markdown
:::details
Hi
:::
::::

### 对齐
::::md-demo 点击查看 Markdown
:::center
center
:::
::::

### 分页
::::md-demo 点击查看 Markdown
::: tabs
@tab Hi
Hi
@tab Hello
Hello
:::
::::

### 分页（代码）
::::md-demo 点击查看 Markdown
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
::::

### Markdown 演示
::::md-demo 点击查看 Markdown
:::md-demo （套娃）点击查看 Markdown
demo `demo` $demo$
:::
::::