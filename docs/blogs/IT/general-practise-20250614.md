---
title: 每周一水
createTime: 2025/6/14
---

## [P2202 [USACO13JAN] Square Overlap S](https://www.luogu.com.cn/problem/P2202)

纯水蓝。提供一个不需要任何算法的解法：

将平面划分为边长为 $k$ 的网格，此时只有以这个点为中心的九宫格才有可能出现重叠。于是，按照中心所在的网格为键开 map，然后枚举即可。

最多只有 $2$ 个正方形重合保证了我们枚举的正方形不超过 $10$ 个，时间复杂度 $O(n)$

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

struct point {
    int x, y;
};

map<pair<int, int>, vector<point>> mp;

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int n, k;
    cin >> n >> k;
    
    int cnt=0, s=0;
    for (int i=1; i<=n; i++){
        int x, y;
        cin >> x >> y;
        int bx = x/k, by = y/k;
        
        for (int xoff=-1; xoff<=1; xoff++){
            for (int yoff=-1; yoff<=1; yoff++){
                for (point p: mp[{bx+xoff, by+yoff}]){
                    int xd = k - abs(x-p.x),
                        yd = k - abs(y-p.y);
                    if (xd>0 && yd>0){
                        cnt++;
                        s += xd * yd;
                        
                        if (cnt > 1){
                            goto finish;
                        }
                    }
                }
            }
        }
        
        mp[{bx, by}].push_back({x, y});
    }
    
finish:
    
    if (cnt > 1){
        cout << -1;
    } else {
        cout << s;
    }

    return 0;
}
```

## [P2208 [USACO13OPEN] What's Up With Gravity S](https://www.luogu.com.cn/problem/P2208)

扒掉壳子，是一个简单的抽象最短路 / 最短路型 dp，由于是 01-最短路，甚至不用 Dijkstra，直接用双端队列模拟即可。时间复杂度 $O(\#\text{footholds}) \le O(nm)$

题意有一些坑点（见注释对样例 2 的修改），没关文件 I/O 爆 $\red{20}$，更是糖到没边。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int maxn=1024;

int n, m;

struct status {
    int flipped, row, col;
};

inline status unpack(int s){
    return {s&1, (s>>1)&1023, (s>>11)&1023};
}

inline int pack(status p){
    return p.flipped | (p.row<<1) | (p.col<<11);
}

char mp[maxn][maxn];
int updown[2][maxn][maxn];  // 0->down; 1->up
int dis[1<<21], vis[1<<21];
status start;
int endr, endc;
int ans = -1;

void deq_bfs(){
    memset(dis, 0x3f, sizeof dis);
    
    deque<int> dq;
    int istart = pack(start);
    dq.push_back(istart);
    dis[istart] = 0;
    
    while (!dq.empty()){
        int u = dq.front();
        dq.pop_front();
        if (vis[u]){
            continue;
        }
        vis[u] = true;
        
        status pu = unpack(u);
        int fl = pu.flipped,
            r = pu.row,
            c = pu.col;
            
//        printf("searching %d, (%d, %d)\n", fl, r, c);
            
        if (endr == r && endc == c){
            ans = dis[u];
            return;
        }
            
        // left
        if (mp[r][c-1]!='#' && updown[fl][r][c-1]!=-1){
            int v = pack(status{fl, updown[fl][r][c-1], c-1});
            if (!vis[v]){
                dis[v] = dis[u];
                dq.push_front(v);
            }
        }
        
        // right
        if (mp[r][c+1]!='#' && updown[fl][r][c+1]!=-1/*超出边界在此处忽略*/){
            int v = pack(status{fl, updown[fl][r][c+1], c+1});
            if (!vis[v]){
                dis[v] = dis[u];
                dq.push_front(v);
            }
        }
        
        // flip
        fl = !fl;
        int v = pack(status{fl, updown[fl][r][c], c});
        if (dis[v] > dis[u] + 1){
            dis[v] = dis[u] + 1;
            dq.push_back(v);
        }
    }
}

void calc_updown(){
    memset(updown, -1, sizeof updown);

    for (int j=1; j<=m; j++){
        for (int i=1; i<=n; i++){
            if (mp[i][j] == '#'){
                continue;
            }
            
            if (mp[i-1][j] == '#' || mp[i][j] == 'D' /*测试点 2*/){
                updown[1][i][j] = i;
            } else {
                updown[1][i][j] = updown[1][i-1][j];
            }
        }
        
        for (int i=n; i>=1; i--){
            if (mp[i][j] == '#'){
                continue;
            }
            
            if (mp[i+1][j] == '#' || mp[i][j] == 'D' /*测试点 2*/){
                updown[0][i][j] = i;
            } else {
                updown[0][i][j] = updown[0][i+1][j];
            }
        }
    }
}

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    cin >> n >> m;
    
    for (int i=1; i<=n; i++){
        cin >> (mp[i] + 1);
        for (int j=1; j<=m; j++){
            if (mp[i][j] == 'C'){
                start = status{0, i, j};
            } else if (mp[i][j] == 'D'){
                endr = i;
                endc = j;
            }
        }
    }
    
    calc_updown();
    
//    for (int ud=0; ud<=1; ud++){
//        for (int i=1; i<=n; i++){
//            for (int j=1; j<=n; j++){
//                printf("%d\t", updown[ud][i][j]);
//            }
//            puts("");
//        }
//        puts("======");
//    }

    // 一开始就掉下来（测试点 2）
    start.row = updown[0][start.row][start.col]; 
    deq_bfs();
    
    cout << ans;

    return 0;
}
 ```

## [P2209 [USACO13OPEN] Fuel Economy S](https://www.luogu.com.cn/problem/P2209)

直接 dp 会炸掉，考虑贪心。

对于加油站 A, B，A 比 B 近：

- 如果加油站 B 比 A 贵，那么就不如直接在 A 加油。因此，除非在 A 加满了，否则不会在 B 加油。
- 如果 B 比 A 便宜，在 B 就可以只加到 A 的油。

将以上两点结合，就得到了贪心策略：

> 对于离加油站 A 最近的加油站 B，如果能直接开到就加到油恰好够之后直接开到 B；否则，把油加满，继续行驶。

时间不够了。

## [P2591 [ZJOI2009] 函数](https://www.luogu.com.cn/problem/P2591)

ybt 发现的注意力神题。

观察数据注意到

$$
\text{ans} = \begin{cases}
1, & n=1, \\
2\min(K, N-K+1), & \text{otherwise}.
\end{cases}
$$

即可。

## 星期三 [P2471 [SCOI2007] 降雨量](https://www.luogu.com.cn/problem/P2471)

算法没什么难的，单纯 ST 板子，但是分支特别多。调了很久，还好数据给力。

这题可以练习一下 `lower_bound` 和 `upper_bound` 的使用。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=5e4+100, logmaxn=16;
int n;
int y[maxn], r[maxn];

struct stt {
    int a[maxn][logmaxn+2];
    
    void init(){
        for (int i=1; i<=n; i++){
            a[i][0] = r[i];
        }
        
        for (int b=1; b<=logmaxn; b++){
            for (int i=1; i+(1<<b)-1<=n; i++){
                a[i][b] = max(a[i][b-1], 
                              a[i+(1<<(b-1))][b-1]);
            }
        }
    }
    
    inline int highbit(int x){
        int i=0;
        while (1){
            x >>= 1;
            if (!x){
                return i;
            }
            i++;
        }
    }
    
    inline int query(int l, int r){
        if (l > r){
            return -1;
        }
        
        int hb = highbit(r-l+1);
        int ln = 1 << hb; 
        return max(a[l][hb], a[r-ln+1][hb]);
    }
} st;

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);

    cin >> n;
    for (int i=1; i<=n; i++){
        cin >> y[i] >> r[i];
    }
    
    st.init();
    
    int m;
    cin >> m;
    for (int i=1; i<=m; i++){
        int xx, yy;
        cin >> yy >> xx;
        
        int y_rec = lower_bound(y+1, y+n+1, yy) - y;
        if (y_rec == n+1){
            cout << "maybe\n";
//          puts("No record");
            continue;
        } 
        int x_rec = lower_bound(y+1, y+n+1, xx) - y;
        if (y[y_rec] == yy && y[x_rec] == xx
             && r[y_rec] < r[x_rec]){
            cout << "false\n";
//          puts("r[x]>r[y]");
            continue;
        }
        
        int segl = upper_bound(y+1, y+n+1, yy) - y,
            segr = lower_bound(y+1, y+n+1, xx) - y - 1;
            
        int maxr = st.query(segl, segr);
//      printf("maxr = %lld at [%lld..%lld]\n", maxr, segl, segr);
        
        if (y[y_rec] == yy && maxr >= r[y_rec]){
            cout << "false\n";
//          puts("max r[(y,x)] >= r[y]");
            continue;
        }
        
        if (y[x_rec] == xx && maxr>=r[x_rec]){
            cout << "false\n";
//          puts("maxr already >= x record");
            continue;
        }
        
        if (segr-segl+1 == xx-yy-1 && 
            y[y_rec] == yy &&
            y[x_rec] == xx && maxr<r[x_rec]){
            cout << "true\n";
//          puts("full record");
            continue;
        }
        
        cout << "maybe\n";
    }

    return 0;
}
```