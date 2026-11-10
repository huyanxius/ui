# 组件约束

- 组件中的颜色、字体、圆角、阴影和动效引用语义变量。圆角用 `rounded-(--radius-control)` 等语法，保留调用方覆盖圆角的能力。`rounded-none` 用于拼接连续表面。尺寸和间距用 Tailwind 刻度。
- 组件内的 Tailwind 类无前缀。消费方扫描本包的 CSS 入口也使用无前缀的 Tailwind 4，并在入口中加 `@source '../node_modules/@huyanxius/ui/src';`，路径相对于该 CSS 文件。
- 新增组件要在 Inkpaw 和 Verify 的浅色、深色下都能预览，主题测试检查实际渲染的颜色、圆角和字体。主题名放在 `html[data-ui-theme]`，这样挂到 body 的弹窗和菜单也能读取变量。
- 全局键盘焦点提示放在 `@layer base`，让控件自己的焦点样式优先。下拉子菜单用 Portal 渲染，避免被父菜单的滚动区裁掉。
- 小浮层外壳用 `--radius-popup`，菜单选项用 `--radius-label` 并内缩一档。内层内容贴边时由外壳裁切，避免叠画圆角。
- Git 依赖直接打包源码。预览构建脚本用 `build:preview`，`build`、`prepare` 等脚本会触发 npm 的 Git 依赖准备流程。
