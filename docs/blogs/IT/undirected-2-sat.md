---
title: 无向 2-SAT
createTime: 2024/12/11
categories:
    - IT
tags:
    - OI
---

## 类型

有数组 $\texttt{bool a[N]}$，给定 $m$ 个约束条件 $a_x \oplus a_y=r$。

## 解法

我们引入一个概念“命题”，命题“$a_i=b$”简记为 $(a,b)$。

我们可以用并查集维护命题的等价关系。

- $a_x \oplus a_y=0$，则 $(x,0) \Leftrightarrow (y,0), (x,1) \Leftrightarrow (y,1)$；
- $a_x \oplus a_y=1$，则 $(x,0) \Leftrightarrow (y,1), (x,1) \Leftrightarrow (y,0)$。

## 解的存在性

有解当且仅当 $\mathop\forall i \in \{1,2,\cdots, N\}, (x,0) \nLeftrightarrow (x,1)$。

## 有解情况下解的个数

显然不被约束的变量相互独立，一旦被直接/间接约束，一定绑在一块。

初始令 $\mathrm{free} \leftarrow n$，每次添加约束且约束两端相互独立时令 $\mathrm{free} \leftarrow \mathrm{free}-1$ 即可。

最终答案即为 $2^\mathrm{free}$。