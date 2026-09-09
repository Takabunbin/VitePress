# Redmi AX6000 OpenWrt Guide

VitePress 文档站，用于记录 Redmi AX6000 从小米原厂系统到 OpenWrt 的分步刷机流程。

## 本地预览

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```

## GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。

在 GitHub 仓库中进入：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

项目仓库名为 `VitePress`，因此 VitePress `base` 已设置为：

```text
/VitePress/
```

启用后默认地址应为：

```text
https://Takabunbin.github.io/VitePress/
```
