---
title: 萤与树与萤 题解
createTime: 2024/12/9
categories:
    - IT
tags:
    - OI
---

## 前言

某一天，我在思考有没有一种树上数据结构问题需要用 bfs 而非 dfs 序维护，然后诞生了这道题。

## 推式子

对于每个修改操作，我们要修改所有的 $v$ 满足
$$\operatorname{dis}(u, v)=\operatorname{dep}(u)+\operatorname{dep}(v)-2\operatorname{dep}(\operatorname{LCA}(u, v)) \le k$$

于是考虑枚举 $\operatorname{dep}(v)$，此时有
$$\operatorname{dep}(\operatorname{LCA}(u,v)) \ge \frac{\operatorname{dep}(u)+\operatorname{dep}(v)-k}{2} $$
即
$$\operatorname{dep}(\operatorname{LCA}(u,v)) \ge \left\lceil \frac{\operatorname{dep}(u)+\operatorname{dep}(v)-k}{2} \right\rceil$$
我们设 $u$ 的深度为 $\left\lceil (\operatorname{dep}(u)+\operatorname{dep}(v)-k) \mathop{/} 2 \right\rceil$ 的祖先为 $r$，则 $r$ 一定是 $\operatorname{LCA}(u,v)$ 的祖先。

于是我们知道，此时 $v$ 一定是 $r$ 的深度为 $\operatorname{dep}(v)$ 的子孙。

从下往上推一遍，即可知所有的 $r$ 的深度为 $\operatorname{dep}(v)$ 的子孙都符合条件。

## 做法

我们考虑在 bfs 序上面建立一棵线段树，这样一棵子树下所有深度相同的节点都是连续的。

只需 dfs 一次，预处理出每个结点对应深度的子孙落在哪一段即可。

> 注：为了存数组方便，数组中的下标是子孙与该结点的**相对深度**。

预处理复杂度 $\operatorname{O}(nk)$，单次修改复杂度 $\operatorname{O}(k \log n)$，总时间复杂度为 $\operatorname{O}(nk + qk \log n)$。

## std

:::details Code

```cpp
...
```

:::
