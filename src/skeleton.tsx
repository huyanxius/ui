import { cn } from 'cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-(--motion-skeleton) rounded-(--radius-skeleton) bg-surface-muted',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
