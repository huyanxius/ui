'use client'

import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'

import { toggleVariants } from './toggle'

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    unstyled?: boolean
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 0,
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  unstyled = false,
  style,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    unstyled?: boolean
  }) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size, spacing, unstyled }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        data-spacing={spacing}
        style={
          {
            '--toggle-spacing': `calc(var(--spacing) * ${spacing})`,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          !unstyled &&
            'group/toggle-group flex w-fit items-center gap-(--toggle-spacing) rounded-(--radius-control) data-[spacing=0]:data-[variant=outline]:shadow-control',
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={
        context.unstyled
          ? className
          : cn(
              toggleVariants({
                variant: context.variant || variant,
                size: context.size || size,
              }),
              'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
              'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-(--radius-control) data-[spacing=0]:last:rounded-r-(--radius-control) data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
              className,
            )
      }
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
