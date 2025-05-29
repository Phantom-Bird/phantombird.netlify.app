---
title: 项目构建指南
---

## 安装依赖
```sh
pnpm i
```

## 更新
```sh
pnpm vp-update
```
记得查看更新日志，以防破坏性更新。

## 预览
```sh
pnpm docs:dev
```

## 构建
```sh
pnpm docs:build
```

## 构建预览
```sh
pnpm docs:preview
```

## 修复 Netlify 大小写 bug
netlify.toml:
```toml
[build.processing.html]
  pretty_urls = false
```