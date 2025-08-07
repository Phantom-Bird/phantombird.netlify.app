---
title: 小 P 的模版集
createTime: 2025/8/7
categories:
    - IT
tags:
    - OI
---

[1](https://hfoj.net/contest/686a894f94662a9af6fafb27/problems) [2](https://hfoj.net/contest/686aac9a94662a9af6fb09ef/problems) [3](https://hfoj.net/contest/686aad2f94662a9af6fb0a21/problems)

## 排序（STL）

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e5+10;
int a[maxn];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n;
    cin >> n;
    for (int i=1; i<=n; i++) {
        cin >> a[i];
    }
    
    sort(a+1, a+n+1);
    
    for (int i=1; i<=n; i++) {
        cout << a[i] << ' ';
    }

    return 0;
}
```

## 线性筛

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn = 1e8+10;
vector<int> primes;
bool notp[maxn];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, q;
    cin >> n >> q;
    
    notp[1] = false;
    
    for (int i=2; i<=n; i++) {
        if (!notp[i]) {
            primes.push_back(i);
        }
        
        for (int p: primes) {
            if (i * p > n) {
                break;
            }
            
            notp[i * p] = true;
            
            if (i % p == 0) {
                break;
            } 
        }
    }
    
    while (q--) {
        int k;
        cin >> k;
        cout << primes[k - 1 /* vector 下标从零开始 */] << '\n';
    }

    return 0;
}
```

## 快速幂

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define pow qpow

int qpow(int a, int b, int p) {
    int ans = 1;
    while (b) {
        if (b & 1) {
            ans *= a;
            ans %= p;
        }
        
        b >>= 1;
        a *= a;
        a %= p;
    }
    
    return ans;
}

signed main() {

    int a, b, p;
    cin >> a >> b >> p;
    printf("%lld^%lld mod %lld=%lld", a, b, p, qpow(a, b, p));

    return 0;
}
```

## 并查集

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=2e5+100;
int fa[maxn], rk[maxn];

void init(int n) {
    for (int i=1; i<=n; i++) {
        fa[i] = i;
        rk[i] = 1;
    }
}

int find(int x) {
    if (fa[x] == x) {
        return x;
    }
    return fa[x] = find(fa[x]);
}

void unify(int x, int y) {
    int fx=find(x), fy=find(y);
    if (rk[fx] < rk[fy]) {
        swap(fx, fy);
    }
    fa[fy] = fx;
    rk[fx] += rk[fy];
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, m;
    cin >> n >> m;
    
    init(n);
    
    while (m--) {
        int z, x, y;
        cin >> z >> x >> y;
        
        if (z == 1) {
            unify(x, y);
        } else {
            cout << ((find(x) == find(y))? "Y\n": "N\n");
        }
    }

    return 0;
}
```

## 优先队列（STL）

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

priority_queue<int, vector<int>, greater<int>> pq;

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n;
    cin >> n;
    while (n--) {
        int op;
        cin >> op;
        
        if (op == 1) {
            int x;
            cin >> x;
            
            pq.push(x);
        } else if (op == 2) {
            cout << pq.top() << '\n';
        } else {
            pq.pop();
        }
    }

    return 0;
}
```

## 单调栈

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=3e6+100;
int a[maxn], f[maxn];
deque<int> q;  // 存下标 

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n;
    cin >> n;
    
    for (int i=1; i<=n; i++) {
        cin >> a[i];
        
        while (!q.empty() && a[q.back()] < a[i]) {
            f[q.back()] = i;
            q.pop_back();
        }
        
        q.push_back(i);
    }
    
    for (int i=1; i<=n; i++) {
        cout << f[i] << ' ';
    }
    
    return 0;
}
```

## 单调队列

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e6+100;
int a[maxn];
deque<int> qmax/*减*/, qmin/*增*/;  // 存下标 
int minans[maxn], maxans[maxn];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, k;
    cin >> n >> k;
    
    for (int i=1; i<=n; i++) {
        cin >> a[i];
        
        while (!qmin.empty() && qmin.front() <= i-k) {
            qmin.pop_front();
        }
        while (!qmax.empty() && qmax.front() <= i-k) {
            qmax.pop_front();
        }
        
        while (!qmin.empty() && a[qmin.back()] >= a[i]) {
            qmin.pop_back();
        }
        while (!qmax.empty() && a[qmax.back()] <= a[i]) {
            qmax.pop_back();
        }
        
        qmin.push_back(i);
        qmax.push_back(i);
        
        minans[i] = a[qmin.front()];
        maxans[i] = a[qmax.front()];
    }
    
    for (int i=k; i<=n; i++) {
        cout << minans[i] << ' ';
    }
    
    cout << '\n';
    
    for (int i=k; i<=n; i++) {
        cout << maxans[i] << ' ';
    }

    return 0;
}
```

## 单源最短路（Dijkstra）

!!SPFA 似了喵！!!

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int maxn=1e5+10, inf=0x3f3f3f3f3f3f3f3fll;

struct edge {
    int v, w;
};

struct node {
    int dis, u;

    bool operator > (const node& a) const {
        return dis > a.dis;
    }
};

vector<edge> G[maxn];
int dis[maxn];
bool vis[maxn];

void dijkstra(int s) {
    memset(dis, 0x3f, sizeof dis);
    priority_queue
        <node, vector<node>, greater<node>> 
            pq;
        
    dis[s] = 0;
    pq.push(node{0, s});
        
    while (!pq.empty()) {
        int u = pq.top().u;
        pq.pop();
        
        if (vis[u]) {
            continue;
        }
        vis[u] = true;
        
        for (auto e: G[u]) {
            if (dis[e.v] > dis[u] + e.w) {
                dis[e.v] = dis[u] + e.w;
                pq.push(node{dis[e.v], e.v}); 
            }
        }
    }
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, m, s;
    cin >> n >> m >> s;
    for (int i=1; i<=m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        G[u].push_back(edge{v, w});
    }
    
    dijkstra(s);
    
    for (int i=1; i<=n; i++) {
        cout << ((dis[i]>=inf)? (1ull<<31)-1: dis[i]) << ' ';
    }

    return 0;
}
```

## nim 游戏 / SG 函数

等等  
先别 nim 了  
我们来看看 SG 函数吧。

1. 对于最终必败态 $S$（接下来无路可走）, $\operatorname{SG}(S) = 0$
2. 对于单个游戏的状态 $S$，
   $$\operatorname{SG}(S) = \operatornamewithlimits{mex}_{T \in S \text{可达的状态} }(T)$$
3. 对于多个游戏，
   $$\operatorname{SG}(\{S_1, S_2, \dots, S_n\}) = \operatorname{SG}(S_1) \oplus \operatorname{SG}(S_2) \oplus \cdots \oplus \operatorname{SG}(S_n)$$
4. 先手必胜 $\iff \operatorname{SG}(G) \ne 0$

由数学归纳法易证：在 nim 游戏中，$\operatorname{SG}(c) = c$

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int T;
    cin >> T;
    
    while (T--) {
        int n, sg=0;
        cin >> n;
        
        while (n--){
            int c;
            cin >> c;
            
            sg ^= c;
        }
        
        cout << (sg==0? "No\n": "Yes\n");
    }

    return 0;
}
```

## 最小生成树（Kruskal）

此算法也是 Kruskal 重构树（常用于解决阈值连通性问题）的基础。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e3+100, maxm=2e5+100;

struct /*desuwa*/ DSU {
    int fa[maxn], rk[maxn];
    
    void init(int n) {
        for (int i=1; i<=n; i++) {
            fa[i] = i;
            rk[i] = 1;
        }
    }
    
    int find(int x) {
        if (fa[x] == x) {
            return x;
        }
        return fa[x] = find(fa[x]);
    }
    
    void unify(int x, int y) {
        x = find(x); y = find(y);
        
        if (rk[x] < rk[y]) {
            swap(x, y);
        }
        
        fa[y] = x;
        rk[x] += rk[y];
    }
} dsu;

struct edge {
    int u, v, w;
    
    bool operator < (const edge &b) const {
        return w < b.w;
    }
} e[maxm];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    
    for (int i=1; i<=m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        e[i] = {u, v, w};
    }
    
    sort(e+1, e+m+1);
    
    dsu.init(n);
    
    int cnt=0, ans=0;
    for (int i=1; i<=m; i++) {
        int u = e[i].u,
            v = e[i].v,
            w = e[i].w;
            
        if (dsu.find(u) == dsu.find(v)) {
            continue;
        }
        
        dsu.unify(u, v);
        ans += w;
        cnt++;
        
        if (cnt == n-1) {
            cout << ans;
            return 0;
        }
    }
    
    cout << "orz";

    return 0;
}
```

## LCA / 树链剖分

此处用树链剖分，  
因为它在树上问题有很多应用（特别是树上数据结构），  
绝对不是因为我被倍增伤透了心。（其实是我自己唐）

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e5+100;
vector<int> G[maxn];
int f[maxn], wson[maxn], siz[maxn], dep[maxn];
int top[maxn];

void dfs1(int u, int fa) {
    f[u] = fa;
    siz[u] = 1;
    dep[u] = dep[fa] + 1;
    
    int wsiz = 0;
    
    for (int v: G[u]) {
        if (v == fa) {
            continue;
        }
        
        dfs1(v, u);
        
        siz[u] += siz[v];
        
        if (siz[v] > wsiz) {
            wsiz = siz[v];
            wson[u] = v;
        }
    }
}

void dfs2(int u, int tp) {
    top[u] = tp;
    
    if (wson[u]) {
        dfs2(wson[u], tp);
    }
    
    for (int v: G[u]) {
        if (v == f[u] || v == wson[u]){
            continue;
        }
        
        dfs2(v, v);
    }
}

int lca(int a, int b) {
    while (top[a] != top[b]) {
        if (dep[top[a]] > dep[top[b]]) {
            a = f[top[a]];
        } else {
            b = f[top[b]];
        }
    }
    
    if (dep[a] > dep[b]) {
        return b;
    } else {
        return a;
    }
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, m, s;
    cin >> n >> m >> s;
    
    for (int i=1; i<=n-1; i++) {
        int u, v;
        cin >> u >> v;
        G[u].push_back(v);
        G[v].push_back(u);
    }
    
    dfs1(s, s);
    dfs2(s, s);
    
    while (m--) {
        int a, b;
        cin >> a >> b;
        cout << lca(a, b) << '\n';
    }

    return 0;
}
```

## ST 表

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e5+100, maxlogn=20;
int lg2[maxn];  // 根据出题人温馨提示保证 O(1)
int st[maxn][maxlogn];
int n, logn;

void pre() {
    lg2[0] = -123456;
    lg2[1] = 0;
    
    for (int i=2; i<=n; i++) {
        lg2[i] = lg2[i >> 1] + 1;
    }
}

void calc() {
    for (int lv=1; lv<=maxlogn; lv++) {
        int len = 1<<lv, hlen = 1<<(lv-1);
        for (int i=1; i<=n-len+1; i++) {
            st[i][lv] = max(st[i][lv-1], st[i+hlen][lv-1]);
        }
    }
}

int query(int l, int r) {
    int lv = lg2[r-l+1];
    return max(
        st[l][lv],
        st[r - (1<<lv) + 1][lv]
    );
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int m;
    cin >> n >> m;
    
    pre();
    logn = lg2[n];
    
    for (int i=1; i<=n; i++) {
        cin >> st[i][0];
    }
    
    calc();
    
    while (m--){
        int l, r;
        cin >> l >> r;
        cout << query(l, r) << '\n';
    }
    
    return 0;
}
```
