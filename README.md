# @huyanxius/ui

适用于 React 19 和 Tailwind CSS 4 的通用组件。基础控件、表单、浮层、反馈、导航和展示组件共用语义令牌。Inkpaw 主题取自 [Inkpaw 前端](https://github.com/hackathon-crew/contest-detective/tree/b55e496368a2b2c2cf643a9c19b35f24af794075/frontend)。

## 接入

用完整提交 SHA 固定版本。npm 可使用同一条 Git URL。

```sh
pnpm add '@huyanxius/ui@git+https://github.com/huyanxius/ui.git#<full-commit-sha>'
```

下面的 `@source` 路径适用于 `src/index.css`，从该文件所在目录算起。组件源码由应用的 React 构建工具编译，Tailwind 入口使用无前缀的工具类。

```css
@import 'tailwindcss';
@import '@huyanxius/ui/theme.css';
@import '@huyanxius/ui/themes/inkpaw.css';
@source '../node_modules/@huyanxius/ui/src';

body {
  @apply bg-canvas font-sans text-ink-soft;
}
```

```html
<html lang="zh-CN" data-ui-theme="inkpaw" data-theme="light">
```

```tsx
import { Button, CenteredDialog } from '@huyanxius/ui'

<Button variant="outline">查看详情</Button>
<CenteredDialog title="详情" closeLabel="关闭详情" onClose={close}>
  {content}
</CenteredDialog>
```

`CenteredDialog` 接收调用方提供的 `closeLabel`。组合底层 `Dialog` 时可以把 `closeLabel` 传给 `DialogContent` 或 `DialogFooter`，分别将关闭操作放在右上角或页脚。日历沿用 DayPicker 的 `locale`。

ToggleGroup 的单选和多选分别使用 `type="single"`、`type="multiple"`。ToggleGroup、Switch 和 Textarea 接受 `unstyled`，便于已有应用沿用自己的样式。

Combobox 组合 Radix Popover 和 cmdk。传入 `items`（含 `value`、`label`、可选的 `disabled`）及 `placeholder`、`searchLabel`、`emptyText`。Toast 在应用内挂载一个 `Toaster`，通过同包导出的 `toast` 发送。EmptyState 和 ErrorState 接收调用方传入的提示，ErrorState 的重试操作由 `onRetry` 和 `retryLabel` 提供。

## 主题

`data-ui-theme` 选择变量表，`data-theme` 在 `light` 和 `dark` 之间切换。把两者设在 `html` 上，挂到 `body` 的菜单和弹窗会一起切换。颜色用 `light-dark()` 定义两套值，`dark:` 工具类跟随显式的 `data-theme="dark"`。

新增主题时可复制 [Inkpaw 变量表](styles/themes/inkpaw.css)，换掉选择器和变量值。应用使用 `bg-surface`、`text-ink` 等语义类，也可以直接读 `var(--color-surface)`。主题入口关闭 Tailwind 的默认调色板。

| 圆角 | 用途 | Inkpaw |
| --- | --- | --- |
| `--radius-label` | 标签、菜单选项和日历选区 | 8px |
| `--radius-control` | 按钮、输入框等控件 | 12px |
| `--radius-popup` | 菜单、选择列表和提示等小浮层的外壳 | 12px |
| `--radius-card` | 内容卡片 | 16px |
| `--radius-dialog` | 弹窗、抽屉 | 24px |
| `--radius-pill` | 胶囊 | 999px |
| `--radius-skeleton` | 骨架屏 | 6px |

小浮层的圆角默认跟随控件。主题可用 `--ui-radius-popup` 单独指定小浮层的圆角。

Verify 用于预览和主题测试。运行 `pnpm dev` 打开组件库首页，进入 `/preview/` 从目录选择组件，查看示例并切换主题与明暗。

## 令牌检查

在 Node 测试里从 `@huyanxius/ui/checks` 导入检查器，并安装 TypeScript。检查器扫描传入目录中的 JSX、TSX 源码及变体中的字面量。传入 `{ semanticRadii: true }` 可以同时拦住 Tailwind 的尺寸圆角和内联圆角。

```ts
import { fileURLToPath } from 'node:url'
import { checkTokens } from '@huyanxius/ui/checks'
import { expect, it } from 'vitest'

it('uses semantic tokens', () => {
  expect(checkTokens(fileURLToPath(new URL('./src', import.meta.url)))).toEqual([])
})
```

[参与贡献](CONTRIBUTING.md) · [Apache-2.0](LICENSE) · [shadcn/ui 许可证](THIRD_PARTY_NOTICES.md)
