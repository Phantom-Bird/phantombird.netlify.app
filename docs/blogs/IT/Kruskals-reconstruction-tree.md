---
title: Kruskal 重构树
createTime: 2024/12/13
tags:
 - OI
categories:
 - IT
---

## 算法

在使用 Kruskal 算法寻找最小（大）生成树的时候，我们创建一颗新的森林。每次我们连接两个点 $u, v$，就在森林中新建一个点 $R$（点权为 $u, v$ 间边的边权），然后把 $\operatorname{root}(u), \operatorname{root}(v)$ 作为 $R$ 的儿子。算法完成后会得到一棵树（森林），我们把它叫作 Kruskal 重构树。

寻找 $\operatorname{root}(u)$ 的过程可以使用并查集实现。维护一个与 Kruskal 重构树逻辑相同的并查集即可。但是记得路径压缩，不然!!你新开一棵和 Kruskal 重构树相同的树不是多此一举？!!会 T 飞。

## 性质

一些需要注意的性质：

- 结点有 $(2n-1)$ 个，要开两倍数组。

一些有用的性质：

- Kruskal 重构树满足大（小）根堆性质；
- 森林中每一棵树代表一个连通块。

## 应用

### 瓶颈路

由于 $u, v$ 在 $\operatorname{LCA}(u, v)$ 加入之后才连通，结合最小（大）生成树的性质，我们可以知道：

$\operatorname{LCA}(u, v)$ 的权为 $u, v$ 间的 $\max(\min)$ 和最短（长）路，即瓶颈路。

### 阈值连通块

对于形如 $w \le k$ 或 $w<k$（$w \ge k$ 或 $w>k$）的约束条件，只保留边权 $w$ 满足约束条件的边，则：

对于每一个 $R$ 满足 $R$ 被保留且 $\operatorname{fa}(R)$ 被删去，以 $R$ 为根的子树是删边后的一个连通块。
