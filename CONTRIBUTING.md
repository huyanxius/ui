# 参与贡献

在 Issue 中写清用法和验收条件。从最新 main 开分支，提交以 `Closes #编号` 关联 Issue 的 PR。等 CI 通过后合并。

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
pnpm test
pnpm build:preview
```

在预览页用键盘和鼠标检查改动的状态，切换 Inkpaw、Verify 以及浅色和深色。浏览器测试通过真实页面读取计算样式。修改主题时也要检查通过 portal 打开的菜单和弹窗。
