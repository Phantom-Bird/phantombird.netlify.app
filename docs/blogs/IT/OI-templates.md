---
title: 小 P 的模板集
createTime: 2025/8/7
categories:
    - IT
tags:
    - OI
---

[1](https://hfoj.net/contest/686a894f94662a9af6fafb27/problems) [2](https://hfoj.net/contest/686aac9a94662a9af6fb09ef/problems) [3](https://hfoj.net/contest/686aad2f94662a9af6fb0a21/problems)

应进一步熟悉：[线段树](#带标记线段树)、[Tarjan](#缩点tarjan)、[Dijstra](#单源最短路dijkstra)

## 空白模板

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define pow qpow  // 如果有快速幂

...

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    ...
    
    return 0;
}
```

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

## 字符串哈希

:::warning 警告
单模数哈希极易碰撞，请结合其他算法
:::

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

    bool operator>(const node& a) const {
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

## manacher

TODO

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

## 三分

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=20;
const double eps=5e-6;

int n;
double l, r;
double coeff[maxn];

double f(double x) {
    double ans=0, m=1;
    for (int i=0; i<=n; i++) {
        ans += m * coeff[i];
        m *= x;
    }
    return ans;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    cin >> n >> l >> r;
    
    for (int i=n; i>=0; i--) {
        cin >> coeff[i];
    }
    
    while (r - l > eps) {
        double m1 = (l * 2 + r) / 3,
               m2 = (l + r * 2) / 3;
        if (f(m1) > f(m2)) {
            r = m2;
        } else {
            l = m1;
        }
    }
    
    cout << (l + r) / 2;
    
    return 0;
}
```

## 负环（SPFA）

!!SPFA 复活了喵!!

入队 $n$ 次则代表有负环

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int maxn=2e3+100;

struct edge {
    int v, w;
};

int n;
vector<edge> G[maxn];
int dis[maxn], cnt[maxn];
bool inq[maxn];

bool spfa() {
    queue<int> q;
    memset(dis, 63, sizeof dis);
    memset(inq, 0, sizeof inq);
    memset(cnt, 0, sizeof cnt);
    
    // 从 1 能到达 
    dis[1] = 0;
    q.push(1);
    inq[1] = true;
    cnt[1] = 1;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inq[u] = false;
        
        for (auto e: G[u]) {
            int v = e.v;
            if (dis[v] > dis[u] + e.w) {
                dis[v] = dis[u] + e.w;
                if (!inq[v]) {
                    q.push(v);
                    inq[v] = true;
                    cnt[v]++;
                    if (cnt[v] >= n) {
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int T;
    cin >> T;
    
    while (T--) {
        int m;
        cin >> n >> m;
        
        for (int i=1; i<=n; i++) {
            G[i].clear();
        }
        
        for (int i=1; i<=m; i++) {
            int u, v, w;
            cin >> u >> v >> w;
            
            G[u].push_back({v, w});
            if (w >= 0) {
                G[v].push_back({u, w});
            }
        }
        
        cout << (spfa()? "YES\n": "NO\n");
    }
    
    return 0;
}
```

## 乘法逆元

质数是好的。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define pow qpow

inline int qpow(int a, int b, int p) {
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

inline int inv(int x, int p) {
    return qpow(x, p-2, p);
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, p;
    cin >> n >> p;
    
    for (int i=1; i<=n; i++) {
        cout << inv(i, p) << '\n';
    }
    
    return 0;
}
```

### 乘法逆元（批量预处理）

$$n^{-1} \equiv - \left\lfloor \frac{p}{i} \right\rfloor \cdot (p \bmod i)^{-1} \pmod{p}$$

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=3e6+100;
int inv[maxn];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, p;
    cin >> n >> p;
    
    inv[1] = 1;
    cout << "1\n";
    
    for (int i=2; i<=n; i++) {
        inv[i] = (p - p/i) * inv[p % i] % p;
        cout << inv[i] << '\n';
    }
    
    return 0;
}
```

## 最大公约数

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

int gcd(int a, int b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n;
    cin >> n;
    
    int g;
    cin >> g;
    
    for (int i=2; i<=n; i++) {
        int a;
        cin >> a;
        g = gcd(g, a);
    }
    
    cout << abs(g);
    
    return 0;
}
```

## 带标记线段树

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e5+100;

struct SegTree {
    int sum[4*maxn], lz[4*maxn];
    int raw[maxn];

    inline int lc(int x) { return x << 1; }
    inline int rc(int x) { return x << 1 | 1; }
    inline int md(int x, int y) { return (x + y) >> 1; }
    
    inline void pushup(int tn, int tl, int tr) {
        sum[tn] = sum[lc(tn)] + sum[rc(tn)];
        // 细分操作都已经 pushdown 过，
        // 因此 pushup 不用再管懒标记。 
    }
    
    inline void pushdown(int tn, int tl, int tr) {
        if (tl == tr) {  // 防止越界 
            return;
        }
        
        int mid = md(tl, tr),
            lcn = lc(tn), rcn = rc(tn);
            
        sum[lcn] += (mid - tl + 1) * lz[tn];
        sum[rcn] += (tr - mid) * lz[tn];
        // 本节点的计算结果应当计入懒标记
        // 因为懒标记仅代表“未下传”
        // 而外部可以直接读计算结果，不用管懒标记 
        
        lz[lcn] += lz[tn];
        lz[rcn] += lz[tn];
        lz[tn] = 0;
    }
    
    void build(int tn, int tl, int tr) {
        if (tl == tr) {
            sum[tn] = raw[tl];
            return;
        }
        
        int mid = md(tl, tr);
        build(lc(tn), tl, mid);
        build(rc(tn), mid+1, tr);
        pushup(tn, tl, tr);
    }
    
    void add(int tn, int tl, int tr, int x, int y, int k) {
        if (y < tl || x > tr) {
            return;
        }
        
        if (x <= tl && tr <= y) {
            lz[tn] += k;
            sum[tn] += k * (tr - tl + 1);
            return;
        }
        
        pushdown(tn, tl, tr);  // 细分操作必须下传懒标记
        int mid = md(tl, tr);
        add(lc(tn), tl, mid, x, y, k);
        add(rc(tn), mid+1, tr, x, y, k); 
        pushup(tn, tl, tr);
    }
    
    int query(int tn, int tl, int tr, int x, int y) {
        if (y < tl || x > tr) {
            return 0;
        }
        
        if (x <= tl && tr <= y) {
            return sum[tn];
        }
        
        pushdown(tn, tl, tr);
        int mid = md(tl, tr);
        return query(lc(tn), tl, mid, x, y) 
             + query(rc(tn), mid+1, tr, x, y); 
    }
    
    void debug(int tn, int tl, int tr) {
        printf("tn=%d tl=%d tr=%d: sum=%d lz=%d\n", tn, tl, tr, sum[tn], lz[tn]);
        
        if (tl == tr) {
            return;
        }
        
        int mid = md(tl, tr);
        debug(lc(tn), tl, mid);
        debug(rc(tn), mid+1, tr); 
    }
} segtree;

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    
    for (int i=1; i<=n; i++) {
        cin >> segtree.raw[i];
    }
    
    segtree.build(1, 1, n);
    
    while (m--) {
        int op;
        cin >> op;
        if (op == 1) {
            int x, y, k;
            cin >> x >> y >> k;
            segtree.add(1, 1, n, x, y, k);
        } else {
            int x, y;
            cin >> x >> y;
            cout << segtree.query(1, 1, n, x, y) << '\n';
        }
    }
    
    return 0;
}
```

## 树状数组

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e5+100;
int n;

struct BIT {
    int a[maxn];
    
    inline int lowbit(int x) {
        return x & -x;
    }
    
    void add(int i, int x) {
        for (; i<=n; i += lowbit(i)) {
            a[i] += x;
        }
    }
    
    int query(int i) {
        int ans=0;
        for (; i; i -= lowbit(i)) {
            ans += a[i];
        }
        return ans;
    }
    
    int query2(int x, int y) {
        return query(y) - query(x - 1);
    }
} bit;

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int m;
    cin >> n >> m;
    
    for (int i=1; i<=n; i++) {
        int a;
        cin >> a;
        bit.add(i, a);
    }
    
    while (m--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (op == 1) {
            bit.add(x, y);
        } else {
            cout << bit.query2(x, y) << '\n';
        }
    }
    
    return 0;
}
```

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e5+100;
int n;

struct BIT {
    int a[maxn];
    
    inline int lowbit(int x) {
        return x & -x;
    }
    
    void add(int i, int k) {
        for (; i<=n; i += lowbit(i)) {
            a[i] += k;
        }
    }
    
    inline void add2(int x, int y, int k) {
        add(x, k);
        add(y+1, -k);
    }
    
    int query(int i) {
        int ans=0;
        for (; i; i -= lowbit(i)) {
            ans += a[i];
        }
        return ans;
    }
} bit;

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int m;
    cin >> n >> m;
    
    for (int i=1; i<=n; i++) {
        int a;
        cin >> a;
        bit.add2(i, i, a);
    }
    
    while (m--) {
        int op;
        cin >> op;
        if (op == 1) {
            int x, y, k;
            cin >> x >> y >> k;
            bit.add2(x, y, k);
        } else {
            int x;
            cin >> x;
            cout << bit.query(x) << '\n';
        }
    }
    
    return 0;
}
```

## KMP

TODO

## 差分约束

不妨设 $G$ 是使得 $\operatorname{dis}_G(u) = x_u$ 的图。

对于边 $u \xrightarrow{w} v$，满足三角形不等式 $\operatorname{dis}(v) - \operatorname{dis}(u) \le w$，  
由 $x_a - x_b \le w$ 不难发现有一条 $b \xrightarrow{w} a$ 的边。

若存在负权回路则无解。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e3+100;

int n;

struct edge {
    int v, w;
};

vector<edge> G[maxn];
int dis[maxn];
bool inq[maxn];
int cnt[maxn];

bool spfa(int s) {
    dis[s] = 0;
    queue<int> q;
    q.push(s);
    inq[s] = true;
    cnt[s]++;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inq[u] = false;
        
        for (auto e: G[u]) {
            int v = e.v;
            if (dis[v] > dis[u] + e.w) {
                dis[v] = dis[u] + e.w;
                
                if (!inq[v]) {
                    q.push(v);
                    inq[v] = true;
                    
                    cnt[v]++;
                    if (cnt[v] >= n) {
                        return false;
                    }
                }
            }
        }
    }
    
    return true;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int m;
    cin >> n >> m;
    
    for (int i=1; i<=n; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        G[v].push_back({u, w});
    }
    
    memset(dis, 0x3f, sizeof dis);
    int inf = dis[0];
    for (int i=1; i<=n; i++) {
        if (dis[i] >= inf) {
            if (!spfa(i)) {
                cout << "NO";
                return 0;
            }
        }
    }
    
    for (int i=1; i<=n; i++) {
        cout << dis[i] << ' ';
    }
    
    return 0;
}
```

## 缩点（Tarjan）

:::tip

tarjan 序即是拓扑序的逆序，缩点完可以直接 dp！

:::

:::details 新样例

样例过水。新样例：

```input
7 11
1 2 2 2 2 1 1
1 2
2 1
1 3
5 6
6 7
7 5
7 4
2 3
3 4
2 5
5 4
```

输出：

```output
8
```

$(1 \to 2 \to 5 \to 6 \to 7 \to 4)$

upd：实际上新样例也很水。想要不水的样例可以看测试点 2

:::

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e4+100, maxm=1e5+100;

vector<int> G[maxn];
int a[maxn];
int u[maxm], v[maxm];
vector<int> H[maxn], Hv[maxn]/*反图*/;

int dfn[maxn], low[maxn];
int dft;
stack<int> s;
int cocnt, co[maxn];
int aco[maxn];

void tarjan(int u) {
    dft++;
    dfn[u] = low[u] = dft;
    s.push(u);
    
    for (int v: G[u]) {
        if (!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (!co[v]) {  // 在强连通分量里面很重要
            low[u] = min(low[u], dfn[v]);
        }
    }
    
//  printf("node #%d: dfn=%d, low=%d\n", u, dfn[u], low[u]);
    
    if (dfn[u] == low[u]) {
        cocnt++;
        
        while (!s.empty()) {
            int v = s.top();
            s.pop();
            
            co[v] = cocnt;
//          printf("node#%d belongs to co#%d\n", v, cocnt);
            
            if (u == v) {
                break;
            }
        }
    }
}

int f[maxn];

void dp() {
    for (int i=1; i<=cocnt; i++) {
        f[i] = aco[i];
        
        for (int v: H[i]) {
            f[i] = max(f[i], f[v] + aco[i]);
        }
    }
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    
    for (int i=1; i<=n; i++) {
        cin >> a[i];
    }
    
    for (int i=1; i<=m; i++) {
        cin >> u[i] >> v[i];
        G[u[i]].push_back(v[i]);
    }
    
    for (int i=1; i<=n; i++) {
        if (!dfn[i]) {  // 同样注意连通性 
            tarjan(i);
        }
    }
    
    // 合并信息与边 
    for (int i=1; i<=n; i++) {
        aco[co[i]] += a[i];
    }
    
    for (int i=1; i<=m; i++) {
        if (co[u[i]] != co[v[i]]) {
            H[co[u[i]]].push_back(co[v[i]]);
        }
    }
    
    dp();
    
    int ans = 0;
    for (int i=1; i<=cocnt; i++) {
        ans = max(ans, f[i]);
    }
    cout << ans;
    
    return 0;
}
```

## 割点 / 点双连通分量

:::tip
再做一次 Flood Fill 即可求出点双连通分量
:::

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=2e4+100;
vector<int> G[maxn];

int dfn[maxn], low[maxn];
int dft;
bool iscv[maxn];
int ans;

void tarjan(int u, int from) {
    dft++;
    dfn[u] = low[u] = dft;
    
    int son=0, blockedson=0;  // 由于根的特殊性，需要计数
    
    for (int v: G[u]) {
        if (v == from) {
            continue;
        }
        
        if (!dfn[v]) {
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
            son++;
            blockedson += (low[v] >= dfn[u]);
        } else {
            low[u] = min(low[u], dfn[v]);
        }
    }
    
//    printf("node#%d, dfn=%d, low=%d, son=%d, blocked=%d\n", u, dfn[u], low[u], son, blockedson);
    
    iscv[u] = (from == -1)? (son >= 2) : (blockedson >= 1);
    // 起点 dfs 树上有两个儿子，则必定为割点
    ans += iscv[u];
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    
    for (int i=1; i<=m; i++) {
        int u, v;
        cin >> u >> v;
        G[u].push_back(v);
        G[v].push_back(u);
    }
    
    for (int i=1; i<=n; i++) {
        if (!dfn[i]) {
            tarjan(i, -1);
        }
    }
    
    cout << ans << '\n';
    for (int i=1; i<=n; i++) {
        if (iscv[i]) {
            cout << i << ' ';
        }
    }
    
    return 0;
}
```

## 割边 / 边双连通分量

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e5+100;
vector<int> G[maxn];
int co[maxn], cocnt;
vector<int> ans[maxn];

int dfn[maxn], low[maxn];
int dft;
stack<int> s;

void tarjan(int u, int from) {
    dft++;
    dfn[u] = low[u] = dft;
    s.push(u);
    
    int multiedges=0;
    
    for (int v: G[u]) {
        if (v == from) {
            multiedges++;
            if (multiedges == 1) {
                continue;  // 来时重边只阻断一条
            }
        }
        
        if (!dfn[v]) {
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
        } else {
            low[u] = min(low[u], dfn[v]);
        }
    }
    
    if (low[u] == dfn[u]) {
        cocnt++;
        
        while (!s.empty()) {
            int v = s.top();
            s.pop();
            
            co[v] = cocnt;
            ans[cocnt].push_back(v);
            
            if (v == u) {
                break;
            }
        }
    }
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    
    for (int i=1; i<=m; i++) {
        int u, v;
        cin >> u >> v;
        G[u].push_back(v);
        G[v].push_back(u);
    }
    
    for (int i=1; i<=n; i++) {
        if (!dfn[i]) {
            tarjan(i, -1);
        }
    }
    
    cout << cocnt << '\n';
    for (int i=1; i<=cocnt; i++) {
        cout << ans[i].size();
        for (int j: ans[i]) {
            cout << ' ' << j;
        }
        cout << '\n';
    }
    
    return 0;
}
```

## 矩阵快速幂

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=120, mod=1e9+7;
int n;

struct Matrix {
    int mat[maxn][maxn];
    
    Matrix() = default;
    
    Matrix(int a) {
        for (int i=1; i<=n; i++) {
            for (int j=1; j<=n; j++) {
                mat[i][j] = (i == j)? a: 0;
            }
        }
    }
};

Matrix operator * (const Matrix &a, const Matrix &b){
    Matrix ans(0);
    
    for (int i=1; i<=n; i++) {
        for (int j=1; j<=n; j++) {
            for (int k=1; k<=n; k++) {
                ans.mat[i][j] += a.mat[i][k] * b.mat[k][j] % mod;
                ans.mat[i][j] %= mod;
            }
        }
    }
    
    return ans;
}

Matrix qpow(Matrix a, int b) {
    Matrix ans(1);
    
    while (b) {
        if (b & 1) {
            ans = ans * a;
        }
        b >>= 1;
        a = a * a;
    }
    
    return ans;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    Matrix mat;
    int k;
    cin >> n >> k;
    
    for (int i=1; i<=n; i++) {
        for (int j=1; j<=n; j++) {
            cin >> mat.mat[i][j];
        }
    }
    
    Matrix ans = qpow(mat, k);
    
    for (int i=1; i<=n; i++) {
        for (int j=1; j<=n; j++) {
            cout << ans.mat[i][j] << ' ';
        }
        cout << '\n';
    }
    
    return 0;
}
```
