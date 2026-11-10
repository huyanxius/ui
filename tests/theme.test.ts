import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, type Browser, type Locator } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'

let server: ViteDevServer
let browser: Browser

beforeAll(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  await server.listen()
  browser = await chromium.launch()
}, 30_000)

afterAll(async () => {
  await browser?.close()
  await server?.close()
})

const palettes = {
  light: {
    inkpaw: {
      accent: 'rgb(63, 95, 214)',
      rule: 'rgb(227, 227, 227)',
      muted: 'rgb(247, 247, 247)',
      surface: 'rgb(255, 255, 255)',
    },
    verify: {
      accent: 'rgb(154, 61, 40)',
      rule: 'rgb(202, 184, 170)',
      muted: 'rgb(233, 224, 216)',
      surface: 'rgb(255, 252, 248)',
    },
  },
  dark: {
    inkpaw: {
      accent: 'rgb(147, 169, 246)',
      rule: 'rgb(56, 61, 56)',
      muted: 'rgb(32, 34, 33)',
      surface: 'rgb(36, 38, 37)',
    },
    verify: {
      accent: 'rgb(244, 163, 138)',
      rule: 'rgb(97, 77, 72)',
      muted: 'rgb(45, 38, 36)',
      surface: 'rgb(52, 44, 41)',
    },
  },
}

async function styleOf(locator: Locator) {
  return locator.evaluate((element) => {
    const {
      backgroundColor,
      borderTopColor,
      borderTopLeftRadius,
      boxShadow,
      fontFamily,
      transitionDuration,
    } = getComputedStyle(element)
    return {
      backgroundColor,
      borderTopColor,
      borderTopLeftRadius,
      boxShadow,
      fontFamily,
      transitionDuration,
    }
  })
}

it.each(['light', 'dark'] as const)(
  'changes the rendered styles of all seven primitives in %s mode',
  async (scheme) => {
    const page = await browser.newPage()
    try {
      const response = await page.goto(new URL('preview/', server.resolvedUrls!.local[0]).href)
      expect(response?.ok(), 'The Vite component preview is available').toBe(true)
      await page.getByLabel('明暗').selectOption(scheme)
      const shadows = []

      for (const theme of ['inkpaw', 'verify'] as const) {
        await page.getByLabel('主题').selectOption(theme)
        const { accent, rule, muted, surface } = palettes[scheme][theme]
        const font = theme === 'inkpaw' ? 'Inter' : 'Georgia'
        const action = page.getByRole('button', { name: '主要操作', exact: true })
        const select = page.getByRole('combobox', { name: '标准选择框' })
        const samples = [
          ['Button', action, 'backgroundColor', accent, 12],
          ['Input', page.getByRole('textbox', { name: '普通输入' }), 'borderTopColor', rule, 12],
          ['Badge', page.getByText('默认标签', { exact: true }), 'backgroundColor', accent, 8],
          [
            'Skeleton',
            page.getByRole('status', { name: '正在加载' }).locator('[data-slot=skeleton]').first(),
            'backgroundColor',
            muted,
            6,
          ],
          [
            'Calendar',
            page.locator('[data-slot=calendar] [data-selected-single=true]'),
            'backgroundColor',
            accent,
            12,
          ],
          ['Select', select, 'borderTopColor', rule, 12],
        ] as const
        for (const [name, locator, property, color, radius] of samples) {
          // Theme changes can start a color transition on controls.
          await expect
            .poll(async () => (await styleOf(locator))[property], { message: name })
            .toBe(color)
          const computed = await styleOf(locator)
          expect(computed.borderTopLeftRadius, name).toBe(
            theme === 'inkpaw' ? radius + 'px' : '0px',
          )
          expect(computed.fontFamily, name).toContain(font)
        }
        expect((await styleOf(action)).transitionDuration).toBe(
          theme === 'inkpaw' ? '0.14s' : '0.08s',
        )

        await select.press('Space')
        const menu = page.getByRole('listbox')
        const menuStyle = await styleOf(menu)
        expect(menuStyle.backgroundColor).toBe(surface)
        expect(menuStyle.borderTopLeftRadius).toBe(theme === 'inkpaw' ? '8px' : '0px')
        expect(menuStyle.fontFamily).toContain(font)
        shadows.push(menuStyle.boxShadow)
        await menu.getByRole('option', { name: '深色' }).click()
        await menu.waitFor({ state: 'hidden' })
        expect(await select.textContent()).toContain('深色')

        await page.getByRole('button', { name: '打开居中弹窗' }).click()
        const dialog = page.getByRole('dialog', { name: '居中弹窗' })
        const dialogStyle = await styleOf(dialog)
        expect(dialogStyle.backgroundColor).toBe(surface)
        expect(dialogStyle.borderTopLeftRadius).toBe(theme === 'inkpaw' ? '24px' : '0px')
        expect(dialogStyle.fontFamily).toContain(font)
        await dialog.getByRole('button', { name: '关闭预览' }).click()
        await dialog.waitFor({ state: 'hidden' })
      }
      expect(shadows[0]).not.toBe(shadows[1])
    } finally {
      await page.close()
    }
  },
  30_000,
)

// Inkpaw's public color and shadow values before the palette split.
const inkpawColors = {
  canvas: ['#f5f5f5', '#1c1e1d'],
  surface: ['#ffffff', '#242625'],
  'surface-muted': ['#f7f7f7', '#202221'],
  'surface-strong': ['#ededed', '#303331'],
  page: ['#ffffff', '#1c1e1d'],
  stage: ['#f5f5f5', '#222423'],
  scrim: ['rgb(17 17 17 / 32%)', 'rgb(0 0 0 / 56%)'],
  ink: ['#111111', '#e6e7e3'],
  'ink-soft': ['#303030', '#c9ccc6'],
  muted: ['#6c6c6c', '#a4aaa2'],
  faint: ['#969696', '#92998f'],
  rule: ['#e3e3e3', '#383d38'],
  'rule-strong': ['#cccccc', '#50574f'],
  accent: ['#3f5fd6', '#93a9f6'],
  'accent-hover': ['#3550bd', '#a9bbf8'],
  'accent-soft': ['#e9eefc', '#2a3150'],
  'accent-line': ['#cdd7f7', '#3a4670'],
  'on-accent': ['#ffffff', '#121a33'],
  danger: ['#98434b', '#e2a3a6'],
  'danger-soft': ['#f8edef', '#382729'],
  'danger-line': ['#ecd3d7', '#553a3d'],
  'notice-line': ['#b8b8b8', '#50574f'],
} as const

const inkpawShadows = {
  control: ['0 1px 2px rgb(17 17 17 / 8%)', '0 1px 2px rgb(0 0 0 / 24%)'],
  card: [
    '0 1px 2px rgb(17 17 17 / 4%), 0 8px 24px rgb(17 17 17 / 6%)',
    '0 1px 2px rgb(0 0 0 / 24%), 0 8px 24px rgb(0 0 0 / 24%)',
  ],
  cover: ['0 2px 6px rgb(17 17 17 / 10%)', '0 2px 6px rgb(0 0 0 / 30%)'],
  focus: ['0 0 0 4px #e9eefc', '0 0 0 4px #2a3150'],
} as const

it.each(['light', 'dark'] as const)('preserves every Inkpaw color and shadow in %s mode', async (scheme) => {
  const page = await browser.newPage()
  try {
    await page.goto(new URL('preview/', server.resolvedUrls!.local[0]).href)
    await page.getByLabel('主题').selectOption('inkpaw')
    await page.getByLabel('明暗').selectOption(scheme)
    const index = scheme === 'light' ? 0 : 1
    const checks = [
      ...Object.entries(inkpawColors).map(([name, values]) => ({
        token: `--color-${name}`, property: 'color', value: values[index],
      })),
      ...Object.entries(inkpawShadows).map(([name, values]) => ({
        token: `--shadow-${name}`, property: 'box-shadow', value: values[index],
      })),
    ]
    const results = await page.evaluate((checks) => {
      const actual = document.body.appendChild(document.createElement('span'))
      const reference = document.body.appendChild(document.createElement('span'))
      return checks.map(({ token, property, value }) => {
        actual.style.setProperty(property, `var(${token})`)
        reference.style.setProperty(property, value)
        return {
          token,
          actual: getComputedStyle(actual).getPropertyValue(property),
          expected: getComputedStyle(reference).getPropertyValue(property),
        }
      })
    }, checks)
    for (const { token, actual, expected } of results) {
      expect(actual, token).toBe(expected)
    }
  } finally {
    await page.close()
  }
})
