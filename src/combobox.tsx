'use client'

import { useState, type ComponentProps, type ReactNode } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from './button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface ComboboxItem {
  value: string
  label: string
  disabled?: boolean
}

type ComboboxProps = Omit<ComponentProps<typeof Button>, 'children' | 'value' | 'defaultValue'> & {
  items: readonly ComboboxItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder: string
  searchLabel: string
  emptyText: ReactNode
}

export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  searchLabel,
  emptyText,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState(defaultValue)
  const selected = value ?? selection

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" type="button" data-slot="combobox-trigger" {...props}>
          {items.find((item) => item.value === selected)?.label ?? placeholder}
          <ChevronsUpDown aria-hidden="true" className="text-muted" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="combobox-content"
        aria-label={searchLabel}
        align="start"
        className="w-64 p-0"
      >
        <Command label={searchLabel}>
          <CommandInput aria-label={searchLabel} placeholder={searchLabel} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                keywords={[item.label]}
                disabled={item.disabled}
                onSelect={() => {
                  if (value === undefined) setSelection(item.value)
                  onValueChange?.(item.value)
                  setOpen(false)
                }}
              >
                {item.label}
                {item.value === selected && <Check aria-hidden="true" className="ml-auto" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
