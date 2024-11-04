---
title: 项目构建指南
---

## 安装依赖
```sh
pnpm i
```

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