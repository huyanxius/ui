// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { Button, CenteredDialog, Input } from '../src'
afterEach(cleanup)
it('keeps disabled actions inert', () => {
  const click = vi.fn()
  render(
    <>
      <Button disabled onClick={click}>
        保存
      </Button>
      <Input aria-label="关键词" />
    </>,
  )
  fireEvent.click(screen.getByRole('button'))
  expect(click).not.toHaveBeenCalled()
  expect(screen.getByRole('textbox', { name: '关键词' })).toBeTruthy()
})
it('closes a centered dialog with Escape', () => {
  const close = vi.fn()
  const trigger = document.createElement('button')
  document.body.append(trigger)
  trigger.focus()
  const view = render(
    <CenteredDialog closeLabel="关闭面板" title="详情" onClose={close}>
      <a href="https://example.com">来源</a>
    </CenteredDialog>,
  )
  expect(screen.getByRole('dialog', { name: '详情' }).contains(document.activeElement)).toBe(true)
  expect(screen.getByRole('button', { name: '关闭面板' })).toBeTruthy()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(close).toHaveBeenCalledOnce()
  view.unmount()
  trigger.remove()
})
it('opens a dialog at its title without preselecting the upload control', () => {
  render(
    <CenteredDialog
      closeLabel="关闭面板"
      title="添加画像"
      description="补充参赛资料"
      onClose={vi.fn()}
    >
      <Input type="file" aria-label="上传简历" />
      <Input aria-label="技能" />
    </CenteredDialog>,
  )
  expect(document.activeElement).toBe(screen.getByRole('heading', { name: '添加画像' }))
  expect(screen.getByRole('dialog', { name: '添加画像', description: '补充参赛资料' })).toBeTruthy()
})
it('mounts dialog content only while open and resets its draft after closing', () => {
  const close = vi.fn()
  const content = (open: boolean) => (
    <CenteredDialog closeLabel="关闭面板" open={open} title="画像" onClose={close}>
      <Input aria-label="临时草稿" defaultValue="" />
    </CenteredDialog>
  )
  const view = render(content(false))
  expect(screen.queryByRole('dialog')).toBeNull()
  view.rerender(content(true))
  fireEvent.change(screen.getByRole('textbox', { name: '临时草稿' }), {
    target: { value: '未确认的内容' },
  })
  view.rerender(content(false))
  expect(screen.queryByRole('dialog')).toBeNull()
  view.rerender(content(true))
  expect((screen.getByRole('textbox', { name: '临时草稿' }) as HTMLInputElement).value).toBe('')
})
