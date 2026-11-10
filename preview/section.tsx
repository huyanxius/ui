import { createContext, useContext, type ReactNode } from 'react'

export const PreviewSectionId = createContext('')

export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  if (useContext(PreviewSectionId) !== id) return null

  return (
    <section
      id={id}
      aria-labelledby={id + '-title'}
      className="mt-6 min-w-0"
    >
      <h2 id={id + '-title'} className="sr-only">
        {title}示例
      </h2>
      <div className="min-h-64 min-w-0 space-y-4 rounded-(--radius-card) border border-rule bg-surface p-5 sm:p-8">
        {children}
      </div>
    </section>
  )
}
