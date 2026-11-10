type ComponentEntry = {
  id: string
  name: string
  description: string
}

export const componentGroups: { name: string; entries: ComponentEntry[] }[] = [
  {
    name: '基础',
    entries: [
      { id: 'button', name: 'Button', description: '触发操作，可选样式、尺寸和交互状态。' },
      { id: 'input', name: 'Input', description: '输入文本、选择文件或显示校验状态。' },
      { id: 'select', name: 'Select', description: '从一组可分组的选项中选择一个值。' },
      { id: 'dialog', name: 'Dialog', description: '在弹窗中集中完成一个任务。' },
      { id: 'badge', name: 'Badge', description: '标注状态、分类和其他短信息。' },
      { id: 'calendar', name: 'Calendar', description: '选择单个日期或日期范围。' },
      { id: 'skeleton', name: 'Skeleton', description: '在内容加载期间保留布局。' },
    ],
  },
  {
    name: '表单',
    entries: [
      { id: 'textarea', name: 'Textarea', description: '输入可换行的文本。' },
      { id: 'checkbox', name: 'Checkbox', description: '切换选中状态，支持部分选中。' },
      { id: 'radio-group', name: 'RadioGroup', description: '从互斥选项中选中一个。' },
      { id: 'switch', name: 'Switch', description: '开启或关闭一项设置。' },
      { id: 'slider', name: 'Slider', description: '通过滑块选择数值或范围。' },
      { id: 'label', name: 'Label', description: '为表单控件提供关联的标签。' },
      { id: 'toggle-group', name: 'ToggleGroup', description: '用一组按钮进行分段选择或多选。' },
      { id: 'combobox', name: 'Combobox', description: '搜索并选择一个选项。' },
      { id: 'field', name: 'Field', description: '把标签、输入控件、说明和错误放在同一组。' },
    ],
  },
  {
    name: '浮层',
    entries: [
      { id: 'alert-dialog', name: 'AlertDialog', description: '在执行重要操作前请求确认。' },
      { id: 'sheet', name: 'Sheet', description: '从屏幕边缘展开内容或操作区。' },
      { id: 'popover', name: 'Popover', description: '在触发控件旁显示一组内容。' },
      { id: 'tooltip', name: 'Tooltip', description: '在悬停或键盘聚焦时显示简短提示。' },
      { id: 'dropdown-menu', name: 'DropdownMenu', description: '显示操作、选择项和子菜单。' },
    ],
  },
  {
    name: '反馈',
    entries: [
      { id: 'toast', name: 'Toast', description: '短暂显示操作结果，支持附加操作。' },
      { id: 'alert', name: 'Alert', description: '在页面内提示需要关注的信息。' },
      { id: 'progress', name: 'Progress', description: '显示任务完成的比例。' },
      { id: 'spinner', name: 'Spinner', description: '指示操作正在进行。' },
      { id: 'empty-state', name: 'EmptyState', description: '解释空列表或空内容，并给出入口。' },
      { id: 'error-state', name: 'ErrorState', description: '显示错误和可用的重试操作。' },
    ],
  },
  {
    name: '导航',
    entries: [
      { id: 'tabs', name: 'Tabs', description: '在同一位置切换相关内容。' },
      { id: 'pagination', name: 'Pagination', description: '在结果页之间切换。' },
      { id: 'breadcrumb', name: 'Breadcrumb', description: '显示当前页面在站点中的位置。' },
    ],
  },
  {
    name: '展示',
    entries: [
      { id: 'card', name: 'Card', description: '组合一项内容的标题、正文和操作。' },
      { id: 'avatar', name: 'Avatar', description: '显示用户头像或替代文字。' },
      { id: 'separator', name: 'Separator', description: '用横线或竖线分隔内容。' },
      { id: 'table', name: 'Table', description: '按行和列呈现数据。' },
      { id: 'accordion', name: 'Accordion', description: '按标题展开或收起一组内容。' },
      { id: 'collapsible', name: 'Collapsible', description: '展开或收起一个内容区。' },
    ],
  },
]

const components = componentGroups.flatMap(({ entries }) => entries)

export function currentComponent() {
  const hash = window.location.hash.slice(1)
  const id = hash === 'calendars' ? 'calendar' : hash
  return components.find((component) => component.id === id) ?? components[0]
}

export function subscribeToComponent(change: () => void) {
  window.addEventListener('hashchange', change)
  return () => window.removeEventListener('hashchange', change)
}
