import type { Page } from 'playwright'

export async function openComponent(page: Page, id: string) {
  await page.getByRole('navigation', { name: '组件目录' }).locator('a[href="#' + id + '"]').click()
  await page.locator('#' + id).waitFor()
}
