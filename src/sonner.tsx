'use client'

import { cn } from 'cn'
import { CircleCheck, Info, OctagonX, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { Spinner } from './spinner'

export function Toaster({ className, icons, ...props }: ToasterProps) {
  return (
    <Sonner
      className={cn('ui-toaster group font-sans', className)}
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <Spinner aria-hidden="true" />,
        ...icons,
      }}
      {...props}
    />
  )
}

export { toast } from 'sonner'
