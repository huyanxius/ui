import type { ReactNode } from 'react'

export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={id + '-title'}
      className="grid min-w-0 scroll-mt-4 gap-4 border-t border-rule py-6 sm:grid-cols-[8rem_minmax(0,1fr)]"
    >
      <h2 id={id + '-title'} className="text-base font-semibold text-ink">
        {title}
      </h2>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  )
}
