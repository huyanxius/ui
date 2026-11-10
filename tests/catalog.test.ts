import { chromium, type Browser, type Locator, type Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, expect, it } from 'vitest'

let server: ViteDevServer
let browser: Browser

beforeAll(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  await server.listen()
  browser = await chromium.launch()
}, 30_000)

afterAll(async () => {
  try {
    await browser?.close()
  } finally {
    await server?.close()
  }
})

async function withPreview(run: (page: Page) => Promise<void>) {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  page.setDefaultTimeout(4_000)
  try {
    await page.goto(new URL('preview/', server.resolvedUrls!.local[0]).href)
    await page.getByRole('heading', { name: 'UI 组件预览' }).waitFor()
    await run(page)
  } finally {
    await page.close()
  }
}

type Color = 'color' | 'backgroundColor' | 'borderTopColor' | 'stroke'

const surfaces = [
  ['Textarea', 'textarea', 'textarea', 'borderTopColor', true],
  ['Checkbox', 'checkbox', '[role=checkbox][aria-checked=true]', 'backgroundColor', true],
  ['RadioGroup', 'radio-group', '[role=radio][aria-checked=true]', 'borderTopColor', true],
  ['Switch', 'switch', '[role=switch][aria-checked=true]', 'backgroundColor', true],
  ['Slider', 'slider', '[data-slot=slider-track]', 'backgroundColor', true],
  ['Label', 'label', 'label', 'color', false],
  [
    'ToggleGroup',
    'toggle-group',
    '[data-slot=toggle-group-item][data-state=on]',
    'backgroundColor',
    true,
  ],
  ['Field', 'field', '[data-slot=field-error]', 'color', false],
  ['Alert', 'alert', '[role=alert]', 'backgroundColor', true],
  ['Progress', 'progress', '[role=progressbar]', 'backgroundColor', true],
  ['Spinner', 'spinner', '[role=status]', 'stroke', false],
  ['EmptyState', 'empty-state', '[data-slot=empty-state]', 'color', false],
  ['Empty', 'empty-state', '[data-slot=empty]', 'borderTopColor', true],
  ['ErrorState', 'error-state', '[role=alert]', 'color', false],
  ['Tabs', 'tabs', '[role=tab][aria-selected=true]', 'backgroundColor', true],
  ['Pagination', 'pagination', 'a[aria-current=page]', 'borderTopColor', true],
  ['Breadcrumb', 'breadcrumb', '[aria-current=page]', 'color', false],
  ['Card', 'card', '[data-slot=card]', 'backgroundColor', true],
  ['Avatar', 'avatar', '[data-slot=avatar-fallback]', 'backgroundColor', true],
  ['Separator', 'separator', '[role=separator]', 'backgroundColor', false],
  ['Table', 'table', '[data-slot=table-container]', 'color', false],
  ['Accordion', 'accordion', '[data-slot=accordion-trigger]', 'color', true],
  ['Collapsible', 'collapsible', '[data-slot=collapsible-trigger]', 'backgroundColor', true],
] as const

const layers = [
  ['Combobox', 'combobox', '选择城市', '[data-slot=combobox-content]', 'backgroundColor'],
  [
    'AlertDialog',
    'alert-dialog',
    '删除草稿',
    '[data-slot=alert-dialog-content]',
    'backgroundColor',
  ],
  ['Sheet', 'sheet', '从右侧打开', '[data-slot=sheet-content]', 'backgroundColor'],
  ['Popover', 'popover', '打开浮层', '[data-slot=popover-content]', 'backgroundColor'],
  ['Tooltip', 'tooltip', '显示说明', '[data-slot=tooltip-content]', 'backgroundColor'],
  [
    'DropdownMenu',
    'dropdown-menu',
    '打开菜单',
    '[data-slot=dropdown-menu-content]',
    'backgroundColor',
  ],
  ['Toast', 'toast', '显示通知', '[data-sonner-toast]', 'backgroundColor'],
] as const

async function readStyle(locator: Locator, color: Color) {
  await locator.waitFor()
  return locator.evaluate((element, property) => {
    const computed = getComputedStyle(element)
    return {
      color: computed[property],
      radius: computed.borderTopLeftRadius,
      font: computed.fontFamily,
    }
  }, color)
}

it.each(['light', 'dark'] as const)(
  'applies both themes to each new component in %s mode',
  async (scheme) => {
    await withPreview(async (page) => {
      await page.getByLabel('明暗').selectOption(scheme)
      const rendered = new Map<string, Awaited<ReturnType<typeof readStyle>>>()
      for (const theme of ['inkpaw', 'verify'] as const) {
        await page.getByLabel('主题').selectOption(theme)
        async function check(name: string, locator: Locator, color: Color, hasRadius: boolean) {
          const computed = await readStyle(locator, color)
          const previous = rendered.get(name)
          expect(computed.font, name).toContain(theme === 'inkpaw' ? 'Inter' : 'Georgia')
          if (previous) {
            expect(computed.color, name).not.toBe(previous.color)
            if (hasRadius) expect(computed.radius, name).not.toBe(previous.radius)
          }
          rendered.set(name, computed)
        }
        for (const [name, section, selector, color, hasRadius] of surfaces) {
          await check(
            name,
            page
              .locator('#' + section)
              .locator(selector)
              .first(),
            color,
            hasRadius,
          )
        }
        for (const [name, section, label, selector, color] of layers) {
          const trigger = page
            .locator('#' + section)
            .getByRole('button', { name: label, exact: true })
          if (name === 'Tooltip') await trigger.focus()
          else await trigger.click()
          const surface = page.locator(selector).filter({ visible: true }).first()
          await check(name, surface, color, true)
          if (name === 'Toast') await surface.getByRole('button', { name: '关闭通知' }).click()
          else await page.keyboard.press('Escape')
          await surface.waitFor({ state: 'hidden' })
        }
      }
    })
  },
  30_000,
)

const modalCases = [
  ['确认框', '#alert-dialog', '删除草稿', '[role=alertdialog]'],
  ['抽屉', '#sheet', '从右侧打开', '[data-slot=sheet-content]'],
  ['模态浮层', '#popover', '打开模态浮层', '[data-slot=popover-content]'],
  ['弹窗', '#dialog', '打开页脚关闭弹窗', '[data-slot=dialog-content]'],
  ['搜索下拉', '#combobox', '选择城市', '[data-slot=combobox-content]'],
] as const

it('keeps keyboard focus within modal layers and restores it after Escape', async () => {
  await withPreview(async (page) => {
    for (const [name, section, label, selector] of modalCases) {
      const trigger = page.locator(section).getByRole('button', { name: label, exact: true })
      await trigger.press('Enter')
      const layer = page.locator(selector).filter({ visible: true }).first()
      await layer.waitFor()
      const focusedInside = () =>
        layer.evaluate((element) => element.contains(document.activeElement))
      await expect.poll(focusedInside, { message: name }).toBe(true)
      await page.keyboard.press('Shift+Tab')
      expect(await focusedInside(), name).toBe(true)
      await page.keyboard.press('Tab')
      expect(await focusedInside(), name).toBe(true)
      await page.keyboard.press('Escape')
      await layer.waitFor({ state: 'hidden' })
      await expect
        .poll(() => trigger.evaluate((el) => document.activeElement === el), { message: name })
        .toBe(true)
    }
  })
}, 30_000)

it('uses arrow-key menu navigation and restores the trigger on dismissal', async () => {
  await withPreview(async (page) => {
    const menuTrigger = page.getByRole('button', { name: '打开菜单', exact: true })
    await menuTrigger.press('ArrowDown')
    const menu = page.getByRole('menu')
    await menu.waitFor()
    await page.keyboard.press('ArrowDown')
    expect(await menu.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Tab')
    expect(await menu.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await menu.waitFor({ state: 'hidden' })
    await expect.poll(() => menuTrigger.evaluate((el) => document.activeElement === el)).toBe(true)

    const select = page.getByRole('combobox', { name: '标准选择框' })
    await select.press('Space')
    const list = page.getByRole('listbox')
    await list.waitFor()
    await page.keyboard.press('ArrowDown')
    expect(await list.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await list.waitFor({ state: 'hidden' })
    await expect.poll(() => select.evaluate((el) => document.activeElement === el)).toBe(true)
  })
})

it('keeps submenu options reachable by pointer and keyboard in a narrow viewport', async () => {
  await withPreview(async (page) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const trigger = page.getByRole('button', { name: '打开菜单', exact: true })
    const exportItem = page.getByRole('menuitem', { name: '导出格式' })
    const csv = page.getByRole('menuitem', { name: 'CSV', exact: true })

    await trigger.click()
    await exportItem.hover()
    await csv.waitFor()
    const point = await csv.evaluate(async (option) => {
      const menus = Array.from(document.querySelectorAll('[role=menu]'))
      await Promise.allSettled(menus.flatMap((menu) => menu.getAnimations().map((a) => a.finished)))
      const bounds = option.getBoundingClientRect()
      const x = bounds.x + bounds.width / 2
      const y = bounds.y + bounds.height / 2
      return { x, y, reachable: option.contains(document.elementFromPoint(x, y)) }
    })
    expect(point.reachable, 'CSV can be reached without scrolling the parent menu').toBe(true)
    await page.mouse.click(point.x, point.y)
    await exportItem.waitFor({ state: 'hidden' })

    await trigger.press('ArrowDown')
    await exportItem.press('ArrowRight')
    await expect.poll(() => csv.evaluate((el) => el === document.activeElement)).toBe(true)
    await page.keyboard.press('ArrowLeft')
    await csv.waitFor({ state: 'hidden' })
    await expect.poll(() => exportItem.evaluate((el) => el === document.activeElement)).toBe(true)
    await page.keyboard.press('Escape')
    await exportItem.waitFor({ state: 'hidden' })
    await expect.poll(() => trigger.evaluate((el) => el === document.activeElement)).toBe(true)
  })
})

it('lets a nonmodal popover dismiss on focus exit and a tooltip leave focus on its trigger', async () => {
  await withPreview(async (page) => {
    const trigger = page.getByRole('button', { name: '打开浮层', exact: true })
    await trigger.press('Enter')
    const content = page.locator('[data-slot=popover-content]')
    const inside = content.getByRole('textbox')
    await inside.waitFor()
    await expect.poll(() => inside.evaluate((el) => el === document.activeElement)).toBe(true)
    await page.keyboard.press('Escape')
    await content.waitFor({ state: 'hidden' })
    await expect.poll(() => trigger.evaluate((el) => el === document.activeElement)).toBe(true)
    await trigger.press('Enter')
    await inside.waitFor()
    await page.getByRole('button', { name: '打开模态浮层' }).focus()
    await content.waitFor({ state: 'hidden' })

    const tooltipTrigger = page.getByRole('button', { name: '显示说明', exact: true })
    await tooltipTrigger.focus()
    const tooltip = page.locator('[data-slot=tooltip-content]')
    await tooltip.waitFor()
    expect(await tooltipTrigger.evaluate((el) => el === document.activeElement)).toBe(true)
    await page.keyboard.press('Escape')
    await tooltip.waitFor({ state: 'hidden' })
    expect(await tooltipTrigger.evaluate((el) => el === document.activeElement)).toBe(true)
  })
})

it('filters combobox options and commits the keyboard selection', async () => {
  await withPreview(async (page) => {
    const trigger = page.locator('#combobox').getByRole('button', { name: '选择城市', exact: true })
    await trigger.press('Enter')
    const search = page.getByRole('combobox', { name: '搜索城市' })
    await search.fill('上海')
    const result = page.getByRole('option', { name: '上海' })
    await result.waitFor()
    await search.press('Enter')
    await result.waitFor({ state: 'hidden' })
    expect(
      await page.locator('#combobox').getByRole('button', { name: '上海', exact: true }).count(),
    ).toBe(1)
  })
})
