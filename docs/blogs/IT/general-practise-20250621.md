---
title: 水 0621
createTime: 2025/6/21
---

## P11088

不难发现能放则放的策略是正确的.

于是考虑如何快速判断能否放下. 起初想的是卡片在所有漏过的区域都与 $s$ 相同，!!看题解发现!! 正难则反，它其实等价于与 $s$ 不同的地方都被别的卡片覆盖.

于是记录下来被覆盖的区域. 类似拓扑排序地，每增加一个覆盖，就把这个地方与 $s$ 不同的卡片的覆盖需求--，直至减为 $0$ 时能被放下.

限制了 $\sum k$，这是可行的关键.

:::warning

1. 被覆盖过的点不要重复减
2. 能把所有卡片放上不代表一定合法，因为可以穿孔到底，需要特判.

:::

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e5+100;

vector<int> card[maxn];
vector<int> cover[maxn];
bool covered[maxn];
int require[maxn];
char s[maxn]; 

int ans[maxn];
int tot;

bool omg_its_bjtj_[maxn];

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    
    int n, m;
    cin >> n >> m;
    cin >> (s+1);
    
    for (int i=1; i<=n; i++){
        int k;
        cin >> k;
        for (int j=1; j<=k; j++){
            int a; char c;
            cin >> a >> c;
            
            card[i].push_back(a);
            omg_its_bjtj_[a] = true;
            if (s[a] != c){
                cover[a].push_back(i);
                require[i]++;
            }
        }
    }
    
    for (int i=1; i<=m; i++){
        if (!omg_its_bjtj_[i]){
            cout << -1;
            return 0;
        }
    }
    
    queue<int> q;
    for (int i=1; i<=n; i++){
        if (!require[i]){
            q.push(i);
        }
    }
    
    while (!q.empty()){
        int u = q.front();
        q.pop();
        tot++;
        ans[tot] = u;
        
//      printf("search %d\n", u);
        
        for (int a: card[u]){
            if (covered[a]){
                continue;
            }
            covered[a] = true;
            
            for (int v: cover[a]){
                require[v]--;
//              printf("covered pos#%d for %d; rest=%d\n", a, v, require[v]);
                if (!require[v]){
                    q.push(v);
                }
            }
        }
    }
    
    if (tot == n){
        for (int i=1; i<=n; i++){
            cout << ans[i] << ' ';
        }
    } else {
        cout << -1;
    }
    
    return 0;
}
```

## [P2407 [SDOI2009] 地图复原](https://www.luogu.com.cn/problem/P2407)

之前做过 [P10278 [USACO24OPEN] Painting Fence Posts S](https://www.luogu.com.cn/problem/P10278) 的应该能想出来.

我们发现弯路确定之后，直路的连法是唯一的.

于是只考虑弯路，就跟 P10278 一样了，直接奇偶配对即可.

由于没有讨厌的环上操作，比 P10278 的实现简单.

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int maxn = 810;


struct point {
    int x, y;
} pts[maxn*maxn];
int tcnt;

bool cmpy(const point &a, const point &b){
    return (a.y == b.y)? (a.x < b.x): (a.y < b.y);
}


struct canvas {
    int n, m;
    char mp[maxn*2][maxn*2];
    
    void init (int n_, int m_) {
        n = n_;
        m = m_;
        memset(mp, ' ', sizeof mp);
        
        for (int i=1; i<=n; i++){
            for (int j=1; j<=m; j++){
                mp[2*i-1][2*j-1] = 'o';
            }
        }
    }
    
    void connect_h(int row, int u, int v){
//      printf("conh(%lld, %lld, %lld)\n", row, u, v);
        for (int i=2*u; i<=2*v-2; i+=2){
            mp[row*2-1][i] = '-';
        }
    }
    
    void connect_v(int col, int u, int v){
//      printf("conv(%lld, %lld, %lld)\n", col, u, v);
        for (int i=2*u; i<=2*v-2; i+=2){
            mp[i][col*2-1] = '|';
        }
    }
    
    void print(){
        for (int i=1; i<=2*n-1; i++){
            for (int j=1; j<=2*m-1; j++){
                putchar(mp[i][j]);
            }
            puts("");
        }
    }
} cv;


signed main(){
    int n, m;
    cin >> n >> m;
    
    cv.init(n, m);
    
    for (int i=1; i<=n; i++){
        for (int j=1; j<=m; j++){
            char c;
            cin >> c;
            if (c == 'T'){
                tcnt++;
                pts[tcnt] = {i, j};
//              printf("%lld: (%lld, %lld)\n", tcnt, i, j);
            }
        }
    }
    
    for (int i=1; i<=tcnt; i+=2){
        cv.connect_h(pts[i].x, 
            pts[i].y, pts[i+1].y);
    }
    
    sort(pts+1, pts+tcnt+1, cmpy);
    for (int i=1; i<=tcnt; i+=2){
        cv.connect_v(pts[i].y,
            pts[i].x, pts[i+1].x);
    }
    
    cv.print();
    
    return 0;
}
```

## P10884 [COCI 2017/2018 #2] San

使用 [Meet in the Middle](meet-in-middle).
