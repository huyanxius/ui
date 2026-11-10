import type { ComponentProps, ReactNode } from 'react'
import { cn } from 'cn'
import { Button } from './button'

export function EmptyState({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-state"
      role="status"
      className={cn('py-8 text-sm text-muted', className)}
      {...props}
    />
  )
}

export function ErrorState({
  className,
  children,
  retryLabel,
  onRetry,
  ...props
}: ComponentProps<'div'> & { retryLabel?: ReactNode; onRetry?: () => void }) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn('flex flex-wrap items-center gap-3 py-6 text-sm text-muted', className)}
      {...props}
    >
      <p>{children}</p>
      {onRetry && (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
