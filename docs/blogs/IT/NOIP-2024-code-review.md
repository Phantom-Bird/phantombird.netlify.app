---
title: 直面心魔——NOIP 2024 回顾（其二）
createTime: 2025/8/6
---

今日贤贤找到了我的 NOIP 的代码。

## 代码分析

这是我 T4 的 0 分代码：

```cpp
#include <bits/stdc++.h>
using namespace std;

const int maxn=5e5+100, maxlogn=20;
int st[maxn][maxlogn+10];
// lca(u,u)=u 可以使用st表
int fa[maxn][maxlogn+10];
int dep[maxn];
vector<int> G[maxn];

void dfs(int u, int from){
    fa[u][0] = from;
    dep[u] = dep[from] + 1;
    for (int v: G[u]){
        if (v == from){
            continue;
        }
        dfs(v, u);
    }
    
    for (int i=1; i<=maxlogn; i++){
        fa[u][i] = fa[fa[u][i-1]][i-1];
    }
}

inline int lca(int x, int y){
    if (dep[x] < dep[y]){
        swap(x, y);
    }
    
    for (int i=maxlogn; i>=0; i--){
        if (dep[fa[x][i]] >= dep[y]){
            x = fa[x][i];
        }
    }
    
    if (x == y){
        return x;
    }
    
    for (int i=maxlogn; i>=0; i--){
        if (fa[x][i] != fa[y][i]){
            x = fa[x][i];
            y = fa[y][i];
        }
    }
    
    return fa[x][0];
}

inline int floorlog(int x){
    int ans=0, pw=1;
    while (pw <= x){
        pw <<= 1;
        if (pw <= x){
            ans++;
        }
    }
    return ans;
}

inline int lcastar(int l, int r){
    int loglen=floorlog(r-l+1);
    return lca(st[l][loglen], st[r-(1<<loglen)+1][loglen]);
}

int main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    freopen("query.in", "r", stdin);
    freopen("query.out", "w", stdout);
    
    int n;
    cin >> n;
    for (int i=1; i<=n-1; i++){
        int u, v;
        cin >> u >> v;
        G[u].push_back(v);
        G[v].push_back(u);
    }
    
    dfs(1, 1);
    
    for (int i=1; i<=n; i++){
        st[i][0] = i;
    }
    for (int len=1; (1<<len)<=n; len++){
        for (int i=1; i<=n-(1<<len)+1; i++){
            st[i][len] = lca(st[i][len-1], st[i+(1<<(len-1))][len-1]);
        }
    }
    
    int q;
    cin >> q;
    
    while (q--){
        int l, r, k;
        cin >> l >> r >> k;
        int ans=0;
        for (int i=l; i+k-1<=r; i++){
            ans = max(ans, dep[lcastar(i, i+k-1)]);
        }
        cout << ans << '\n';
    }
    
    return 0;
}
```

找到哪里有问题了吗？

贤贤发现问题在此处：

```cpp
void dfs(int u, int from){
    fa[u][0] = from;
    dep[u] = dep[from] + 1;
    for (int v: G[u]){  // [!code error:6]
        if (v == from){
            continue;
        }
        dfs(v, u);
    }
    
    for (int i=1; i<=maxlogn; i++){  // [!code error:3]
        fa[u][i] = fa[fa[u][i-1]][i-1];
    }
}
```

`fa` 数组在 `dfs` 之前还未更新，导致下层递归无法获取正确的祖先信息。

交换这两段代码，可以在洛谷的数据上拿到 $\color{red}{32}$ 分。

什么概念？这 $\color{red}{32}$ 分已经可以让 P 某拿到省一，少努力一年了。

## tips

为什么能过样例一？——样例太水。  
为什么能过手造样例？——只有天知道。

为了避免玄学导致的错误：

- **打熟板子**
- **仔细捋清逻辑**（这是源头上的办法）
- **分步测试**
- **手造样例**（多几组，刁钻一些）
- **打印重要变量/数组**（记得删，不过交之前一般会过一遍 `cp`）

## 附录：另外两道题的代码

### T1

```cpp
#include <bits/stdc++.h>
using namespace std;

const int maxn=1e5+100;
char s1[maxn], s2[maxn], t1[maxn], t2[maxn];

int belong1[maxn], belong2[maxn];

struct area {
    int cnt[4];
} sa1[maxn], sa2[maxn];
int sa1tot, sa2tot;

inline int min3(int a, int b, int c){
    return min(min(a, b), c);
}

int main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    freopen("edit.in", "r", stdin);
    freopen("edit.out", "w", stdout);
    
    int t;
    cin >> t;
    while (t--){
        memset(sa1, 0, sizeof sa1);
        memset(sa2, 0, sizeof sa2);
        sa1tot = sa2tot = 0;
        
        int n;
        cin >> n;
        cin >> s1+1 >> s2+1 >> t1+1 >> t2+1;
        
        for (int i=1; i<=n; i++){
            // new block?
            bool n1 = (t1[i]=='0' || t1[i]!=t1[i-1]);
            bool n2 = (t2[i]=='0' || t2[i]!=t2[i-1]);
//          printf("#%d n1=%d n2=%d\n", i, n1, n2);
            sa1tot += n1;
            sa2tot += n2;
            
            sa1[sa1tot].cnt[s1[i]-'0']++;
            sa2[sa2tot].cnt[s2[i]-'0']++;
            
            belong1[i] = sa1tot;
            belong2[i] = sa2tot;
        }
        
        int ans=0;
        for (int i=1; i<=n; i++){
            int bl1 = belong1[i], bl2=belong2[i];
            if (sa1[bl1].cnt[0] && sa2[bl2].cnt[0]){
//              printf("%d use %d # %d %d\n", i, 0, sa1[bl1].cnt[0], sa2[bl2].cnt[0]);
                sa1[bl1].cnt[0]--;
                sa2[bl2].cnt[0]--;
                ans++;
            } else if (sa1[bl1].cnt[1] && sa2[bl2].cnt[1]){
//                printf("%d use %d\n", i, 1);
                sa1[bl1].cnt[1]--;
                sa2[bl2].cnt[1]--;
                ans++;
            }
        }
        cout << ans << '\n';
    }
    
    return 0;
}
```

### T2

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

const ll maxm=1e5+100, mod=1e9+7;
struct xianz {
    long long c, d;
    bool operator < (xianz &other){
        return c < other.c;
    }
    bool operator == (xianz &other){
        return c==other.c && d==other.d;
    }
} xz[maxm];

ll qpow(ll a, ll b){
    ll ans=1;
    while (b){
        if (b&1){
            ans *= a;
            ans %= mod;
        }
        a *= a;
        a %= mod;
        b >>= 1;
    }
    return ans % mod;
}

int main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    freopen("assign.in", "r", stdin);
    freopen("assign.out", "w", stdout);
    
    int t;
    cin >> t;
    while(t--){
//      memset(xz, 0, sizeof xz);
        long long n, m, v;
        cin >> n >> m >> v;
        for (int i=1; i<=m; i++){
            cin >> xz[i].c >> xz[i].d;
        }
        
        sort(xz+1, xz+m+1);
        m = unique(xz+1, xz+m+1) - (xz+1);
        
        ll ans=1;
        bool ansis0 = false;
        for (int i=2; i<=m; i++){
            if (xz[i].c == xz[i-1].c){
                ansis0 = true;
                break;
            }
            
            ll thans = qpow(v, 2*(xz[i].c-xz[i-1].c));
            ll noans = qpow(v, xz[i].c-xz[i-1].c-1);
            noans = noans * (v-1) % mod;
            ans *= (thans-noans+mod) % mod;
            ans %= mod;
//          printf("thans=%d, noans=%d\n", thans, noans);
        }
        
        if (m){
            ans *= qpow(v, 2*(xz[1].c-1));
            ans %= mod;
            ans *= qpow(v, 2*(n-xz[m].c));
            ans %= mod;
        } else {
            ans *= qpow(v, 2*(n-1));
            ans %= mod;
        }
        
        if (ansis0){
            cout << "0\n";
        } else {
            cout << ((ans+mod)%mod) << '\n';
        }
    }
    
    
    return 0;
}
```
