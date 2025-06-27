---
title: 插头 DP 工具集
createTime: 2024/12/05
categories:
    - IT
tags:
    - OI
    - OI-note
---

## 定义

```cpp
int n, m;
const int bits=..., mask=(1<<bits)-1;  // 状压位宽
const int LP=..., RP=...;  // 左右括号
```

## 哈希表与滚动数组

```cpp
unordered_map<int, int> umap1, umap2;
auto *pre=&umap1, *dp=&umap2;

inline void roll(){
    // 滚动数组 
    swap(pre, dp);
    dp->clear();
}
```

## 状态压缩

### at（取下标）

```cpp
inline int at(int x, int i){
    return (x>>(i*bits)) & mask;
}
```

### clr（置零）

```cpp
inline int clr(int x, int i){
    return x & ~(mask<<(bits*i));
}
```

### add（置零后赋值）

```cpp
inline int add(int x, int i, int a){
    return x | (a<<(bits*i)); 
}
```

### sets（赋值）

```cpp
inline int sets(int x, int i, int a){
    return add(clr(x, i), i, a);
}
```

### clr2

```cpp
inline int clr2(int x, int i){
    return clr(clr(x, i-1), i);
}
```

### add2

```cpp
inline int add2(int x, int i, int a0, int a1){
    return add(add(x, i-1, a0), i, a1);
}
```

### find_right（找右括号）

```cpp
inline int find_right(int state, int j){
    int sta=0;  // 只用记录栈深度就行
    for (int k=j; k<=m; k++){
        int plug=at(state, k);
        if (plug == LP){
            sta++;
        } else if (plug == RP) {
            sta--;
            if (!sta){
                return k;
            }
        }
    }
    
    return -1;
}
```

### find_left（找左括号）

```cpp
inline int find_left(int state, int j){
    int sta=0;
    for (int k=j; k>=0; k--){
        int plug=at(state, k);
        if (plug == RP){
            sta++;
        } else if (plug == LP){
            sta--;
            if (!sta){
                return k;
            }
        }
    }
    
    return -1;
}
```

### find_cc（找连通块）

```cpp
inline int find_cc(int state, int j){
    return (at(state, j) == LP)?
        find_right(state, j): 
        ((at(state, j) == RP)? find_left(state, j): -1);
} 
```

## 主循环

```cpp
for (int i=1; i<=n; i++){
    roll();
    for (auto [state, cnt]: *pre){
        insert(state<<bits, cnt);
    }

    for (int j=1; j<=m; j++){
        roll();
        for (auto [state, cnt]: *pre){
            work(i, j, state, cnt);
        }
    }
}
```
