import * as React from 'react'
import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 rounded-(--radius-control) border border-input bg-transparent px-2.5 py-1 text-sm transition duration-(--motion-fast) ease-out outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-accent-line focus-visible:ring-4 focus-visible:ring-accent-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-50 aria-invalid:border-danger-line aria-invalid:ring-4 aria-invalid:ring-danger-soft',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
