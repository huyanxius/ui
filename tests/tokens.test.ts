import { expect, it } from 'vitest'
import { checkTokens, findTokenViolations } from '../checks/tokens'

it.each([
  ['<div className="text-[13px] bg-[#fff]" />', 'arbitrary utility'],
  ['<div style={{ color: "red" }} />', 'inline color'],
  ['<path stroke="#2468ef" />', 'inline color'],
  ['const variants = cva("bg-rose-500 hover:text-white");', 'palette color'],
  ['const variants = cva("focus:ring-[rgb(1_2_3)]");', 'arbitrary utility'],
])('detects a hard-coded style in %s', (source, expected) => {
  expect(findTokenViolations(source)).toContain(expected)
})

it('distinguishes semantic radii from size-based radii', () => {
  expect(findTokenViolations('cva("rounded-xl")', { semanticRadii: true })).toContain(
    'fixed radius',
  )
  expect(
    findTokenViolations('<div style={{ borderRadius: 10 }} />', { semanticRadii: true }),
  ).toContain('fixed radius')
  expect(findTokenViolations('<div className="rounded-xl text-ink" />')).toEqual([])
  expect(
    findTokenViolations(
      'cva("rounded-(--radius-control) data-selected:rounded-r-(--radius-label) rounded-none text-ink")',
      { semanticRadii: true },
    ),
  ).toEqual([])
})

it('uses semantic tokens throughout the package components', () => {
  expect(checkTokens(new URL('../src', import.meta.url).pathname, { semanticRadii: true })).toEqual(
    [],
  )
})
