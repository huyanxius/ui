import * as React from 'react'
import { cn } from 'cn'

function Textarea({
  className,
  unstyled = false,
  ...props
}: React.ComponentProps<'textarea'> & { unstyled?: boolean }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        !unstyled &&
          'flex field-sizing-content min-h-16 w-full rounded-(--radius-control) border border-input bg-transparent px-3 py-2 text-base shadow-control transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-line aria-invalid:ring-3 aria-invalid:ring-danger-soft md:text-sm dark:bg-input/30',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
