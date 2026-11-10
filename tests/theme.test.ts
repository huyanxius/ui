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
      const response = await page.goto(server.resolvedUrls!.local[0])
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
