import { useState, type ComponentProps, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Plus } from 'lucide-react'
import { zhCN } from 'react-day-picker/locale'
import {
  Badge,
  Button,
  Calendar,
  CenteredDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '../src'
import './styles.css'

const variants = [
  ['default', '默认'],
  ['outline', '描边'],
  ['secondary', '次要'],
  ['ghost', '幽灵'],
  ['destructive', '危险'],
  ['link', '链接'],
] as const

const sizes = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
const selectedDay = new Date(2026, 10, 10)
const calendarProps = {
  defaultMonth: selectedDay,
  today: new Date(2026, 10, 11),
  locale: zhCN,
  disabled: { dayOfWeek: [0, 6] },
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 gap-4 border-t border-rule py-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  )
}

function ButtonSamples() {
  return (
    <Section title="按钮">
      <div className="flex flex-wrap items-center gap-2">
        {variants.map(([variant, label]) => (
          <Button key={variant} variant={variant}>
            {variant === 'default' ? '主要操作' : label}
          </Button>
        ))}
      </div>
      <div data-slot="button-group" className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => (
          <Button key={size} size={size} variant="outline" aria-label={size}>
            {size.startsWith('icon') ? <Plus aria-hidden="true" /> : size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>禁用</Button>
        <Button aria-invalid="true">无效</Button>
        <Button variant="outline" aria-expanded="true">
          已展开
        </Button>
        <Button asChild variant="outline">
          <a href="#calendars">
            跳到日历 <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </Section>
  )
}

function SelectSample({
  label,
  size,
  position,
  ...props
}: ComponentProps<typeof Select> & {
  label: string
  size?: 'sm' | 'default'
  position?: 'item-aligned' | 'popper'
  invalid?: boolean
}) {
  const { invalid, ...selectProps } = props
  return (
    <Select {...selectProps}>
      <SelectTrigger aria-label={label} aria-invalid={invalid} size={size}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent position={position}>
        <SelectGroup>
          <SelectLabel>外观</SelectLabel>
          <SelectItem value="light">浅色</SelectItem>
          <SelectItem value="dark">深色</SelectItem>
          <SelectSeparator />
          <SelectItem value="system" disabled>
            跟随系统（禁用）
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function DialogSamples() {
  const [open, setOpen] = useState(false)
  return (
    <Section title="弹窗">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setOpen(true)}>
          打开居中弹窗
        </Button>
        <CenteredDialog
          open={open}
          onClose={() => setOpen(false)}
          title="居中弹窗"
          description="焦点先落在标题，按 Esc 可返回。"
          closeLabel="关闭预览"
          footer={
            <Button variant="outline" onClick={() => setOpen(false)}>
              完成
            </Button>
          }
        >
          <Input aria-label="草稿" placeholder="输入一条草稿" />
        </CenteredDialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">打开页脚关闭弹窗</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>带页脚的弹窗</DialogTitle>
              <DialogDescription>关闭操作放在页脚。</DialogDescription>
            </DialogHeader>
            <DialogFooter closeLabel="返回预览" />
          </DialogContent>
        </Dialog>
      </div>
    </Section>
  )
}

function Calendars() {
  const [day, setDay] = useState<Date | undefined>(selectedDay)
  const [range, setRange] = useState<{ from: Date | undefined; to?: Date }>({
    from: selectedDay,
    to: new Date(2026, 10, 13),
  })
  return (
    <Section title="日历">
      <div id="calendars" className="flex flex-wrap gap-4">
        <div>
          <p className="mb-2 text-sm text-muted">单选</p>
          <Calendar {...calendarProps} mode="single" selected={day} onSelect={setDay} />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted">日期范围、月份选择与周数</p>
          <Calendar
            {...calendarProps}
            mode="range"
            required
            selected={range}
            onSelect={setRange}
            captionLayout="dropdown"
            showWeekNumber
            showOutsideDays={false}
            buttonVariant="outline"
          />
        </div>
      </div>
    </Section>
  )
}

function App() {
  const selectClass =
    'rounded-(--radius-control) border border-rule bg-surface px-2 py-1.5 text-ink'

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink">UI 组件预览</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            主题
            <select
              className={selectClass}
              defaultValue="inkpaw"
              onChange={(event) => {
                document.documentElement.dataset.uiTheme = event.currentTarget.value
              }}
            >
              <option value="inkpaw">Inkpaw</option>
              <option value="verify">Verify</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            明暗
            <select
              className={selectClass}
              defaultValue="light"
              onChange={(event) => {
                document.documentElement.dataset.theme = event.currentTarget.value
              }}
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </label>
        </div>
      </header>
      <ButtonSamples />
      <Section title="标签">
        <div className="flex flex-wrap items-center gap-2">
          {variants.map(([variant, label]) => (
            <Badge key={variant} variant={variant}>
              {label}标签
            </Badge>
          ))}
          <Badge asChild variant="outline">
            <a href="#calendars">可点击标签</a>
          </Badge>
          <Badge variant="outline" aria-invalid="true">
            无效标签
          </Badge>
        </div>
      </Section>
      <Section title="输入框">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input aria-label="普通输入" placeholder="普通输入" />
          <Input aria-label="文件输入" type="file" />
          <Input aria-label="禁用输入" placeholder="禁用" disabled />
          <Input aria-label="无效输入" defaultValue="格式有误" aria-invalid="true" />
        </div>
      </Section>
      <Section title="选择框">
        <div className="flex flex-wrap gap-2">
          <SelectSample label="标准选择框" defaultValue="light" />
          <SelectSample label="紧凑选择框" size="sm" position="popper" />
          <SelectSample label="禁用选择框" disabled />
          <SelectSample label="无效选择框" invalid />
        </div>
      </Section>
      <DialogSamples />
      <Section title="骨架屏">
        <div role="status" aria-label="正在加载" className="flex max-w-72 items-center gap-3">
          <Skeleton className="size-10 shrink-0" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </Section>
      <Calendars />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
