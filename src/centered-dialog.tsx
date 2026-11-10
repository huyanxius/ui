import { useId, useRef, type ReactNode } from 'react'
import { cn } from 'cn'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

export function CenteredDialog({
  open = true,
  title,
  closeLabel,
  onClose,
  children,
  description,
  icon,
  className,
  footer,
}: {
  open?: boolean
  title: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
  description?: string
  icon?: ReactNode
  className?: string
  footer?: ReactNode
}) {
  const descriptionId = useId()
  const titleRef = useRef<HTMLHeadingElement>(null)
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        closeLabel={closeLabel}
        aria-describedby={description ? descriptionId : undefined}
        className={cn('max-h-5/6 p-6 sm:p-8', className)}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          titleRef.current?.focus({ preventScroll: true })
        }}
      >
        <DialogHeader className="shrink-0 pr-8">
          {icon ? (
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center text-ink"
              >
                {icon}
              </span>
              <DialogTitle ref={titleRef} tabIndex={-1} className="outline-none">
                {title}
              </DialogTitle>
            </div>
          ) : (
            <DialogTitle ref={titleRef} tabIndex={-1} className="outline-none">
              {title}
            </DialogTitle>
          )}
          {description && <DialogDescription id={descriptionId}>{description}</DialogDescription>}
        </DialogHeader>
        {/* 外扩的焦点圈最多占 4px；负外边距让字段仍与标题、页脚对齐。 */}
        <div className="-m-1 min-h-0 overflow-y-auto p-1">{children}</div>
        {footer && <div className="shrink-0 border-t border-rule pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
