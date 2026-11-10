import { useState, type ReactNode } from 'react'
import { Archive, Info, TriangleAlert } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyState,
  EmptyTitle,
  ErrorState,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toaster,
  toast,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../src'
import { Section } from './section'

const cities = [
  { value: 'wuhan', label: '武汉' },
  { value: 'shanghai', label: '上海' },
  { value: 'hangzhou', label: '杭州', disabled: true },
] as const

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

function Forms() {
  return (
    <>
      <Section id="textarea" title="多行输入">
        <div className="grid gap-2 sm:grid-cols-2">
          <Textarea aria-label="普通多行输入" placeholder="输入备注" />
          <Textarea aria-label="无效多行输入" aria-invalid defaultValue="备注过长" />
          <Textarea aria-label="只读多行输入" readOnly value="这条备注已归档" />
          <Textarea aria-label="禁用多行输入" disabled placeholder="禁用" />
        </div>
      </Section>
      <Section id="checkbox" title="复选框">
        <Row>
          {(
            [
              ['check-on', '已选', true],
              ['check-off', '未选', false],
              ['check-mixed', '部分选择', 'indeterminate'],
            ] as const
          ).map(([id, label, value]) => (
            <Label key={id} htmlFor={id}>
              <Checkbox id={id} defaultChecked={value} />
              {label}
            </Label>
          ))}
          <Label htmlFor="check-disabled">
            <Checkbox id="check-disabled" disabled />
            禁用
          </Label>
          <Label htmlFor="check-error">
            <Checkbox id="check-error" aria-invalid />
            无效
          </Label>
        </Row>
      </Section>
      <Section id="radio-group" title="单选框">
        <RadioGroup defaultValue="mail" aria-label="联系渠道">
          <Label htmlFor="radio-mail">
            <RadioGroupItem id="radio-mail" value="mail" />
            邮箱
          </Label>
          <Label htmlFor="radio-message">
            <RadioGroupItem id="radio-message" value="message" />
            站内消息
          </Label>
          <Label htmlFor="radio-disabled">
            <RadioGroupItem id="radio-disabled" value="sms" disabled />
            短信（禁用）
          </Label>
          <Label htmlFor="radio-error">
            <RadioGroupItem id="radio-error" value="phone" aria-invalid />
            电话（无效）
          </Label>
        </RadioGroup>
      </Section>
      <Section id="switch" title="开关">
        <Row>
          <Label htmlFor="switch-enabled">
            <Switch id="switch-enabled" defaultChecked />
            已开启
          </Label>
          <Label htmlFor="switch-small">
            <Switch id="switch-small" size="sm" />
            紧凑
          </Label>
          <Label htmlFor="switch-disabled">
            <Switch id="switch-disabled" disabled />
            禁用
          </Label>
        </Row>
      </Section>
      <Section id="slider" title="滑块">
        <div className="grid max-w-80 gap-4">
          <Slider defaultValue={[40]} aria-label="音量" />
          <Slider defaultValue={[20, 80]} aria-label="价格范围" />
          <Slider defaultValue={[50]} aria-label="禁用滑块" disabled />
          <Slider orientation="vertical" defaultValue={[60]} aria-label="垂直滑块" />
        </div>
      </Section>
      <Section id="label" title="标签文案">
        <div className="max-w-72 space-y-2">
          <Label htmlFor="catalog-name">项目名称</Label>
          <Input id="catalog-name" />
          <div className="group space-y-2" data-disabled="true">
            <Label htmlFor="catalog-readonly">归档编号</Label>
            <Input id="catalog-readonly" disabled />
          </div>
        </div>
      </Section>
      <Section id="toggle-group" title="分段与多选">
        <ToggleGroup type="single" defaultValue="list" spacing={1} aria-label="视图">
          <ToggleGroupItem value="list">列表</ToggleGroupItem>
          <ToggleGroupItem value="grid">网格</ToggleGroupItem>
          <ToggleGroupItem value="map" disabled>
            地图
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          defaultValue={['web', 'desktop']}
          aria-label="平台"
        >
          <ToggleGroupItem value="web">网页</ToggleGroupItem>
          <ToggleGroupItem value="desktop">桌面</ToggleGroupItem>
          <ToggleGroupItem value="mobile">手机</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          defaultValue="bold"
          aria-label="字重"
        >
          <ToggleGroupItem value="normal">常规</ToggleGroupItem>
          <ToggleGroupItem value="bold">加粗</ToggleGroupItem>
        </ToggleGroup>
      </Section>
      <Section id="combobox" title="搜索选择">
        <Row>
          <div className="space-y-2">
            <p className="text-sm text-muted">默认</p>
            <Combobox
              items={cities}
              placeholder="选择城市"
              searchLabel="搜索城市"
              emptyText="没有匹配城市"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted">禁用</p>
            <Combobox
              items={cities}
              defaultValue="wuhan"
              disabled
              placeholder="禁用"
              searchLabel="搜索城市"
              emptyText="没有匹配城市"
            />
          </div>
        </Row>
      </Section>
      <Section id="field" title="字段组合">
        <FieldSet>
          <FieldLegend>报名信息</FieldLegend>
          <FieldGroup>
            <Field data-invalid="true">
              <FieldLabel htmlFor="catalog-email">联系邮箱</FieldLabel>
              <Input
                id="catalog-email"
                aria-invalid
                defaultValue="example"
                aria-describedby="catalog-email-error"
              />
              <FieldDescription>用于接收报名结果。</FieldDescription>
              <FieldError id="catalog-email-error" errors={[{ message: '输入完整邮箱地址。' }]} />
            </Field>
            <FieldSeparator>通知偏好</FieldSeparator>
            <Field orientation="horizontal">
              <Checkbox id="catalog-field-check" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="catalog-field-check">邮件提醒</FieldLabel>
                <FieldDescription>比赛开始前发送一次。</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="responsive" data-disabled="true">
              <FieldContent>
                <FieldTitle>已归档</FieldTitle>
                <FieldDescription>归档后关闭提醒。</FieldDescription>
              </FieldContent>
              <Switch disabled aria-label="归档提醒" />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Section>
    </>
  )
}

function Layers() {
  const [checked, setChecked] = useState(true)
  const [density, setDensity] = useState('regular')
  return (
    <>
      <Section id="alert-dialog" title="确认框">
        <Row>
          {(['default', 'sm'] as const).map((size) => (
            <AlertDialog key={size}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">{size === 'default' ? '删除草稿' : '紧凑确认框'}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size={size}>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <TriangleAlert />
                  </AlertDialogMedia>
                  <AlertDialogTitle>删除草稿？</AlertDialogTitle>
                  <AlertDialogDescription>草稿删除后无法恢复。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">删除</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </Row>
      </Section>
      <Section id="sheet" title="抽屉">
        <Row>
          {(
            [
              ['right', '右侧'],
              ['left', '左侧'],
              ['top', '顶部'],
              ['bottom', '底部'],
            ] as const
          ).map(([side, label]) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">从{label}打开</Button>
              </SheetTrigger>
              <SheetContent side={side} closeLabel="关闭抽屉" showCloseButton={side !== 'bottom'}>
                <SheetHeader>
                  <SheetTitle>编辑资料</SheetTitle>
                  <SheetDescription>更改项目的显示名称。</SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <Input aria-label="显示名称" defaultValue="参赛计划" />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>完成</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Row>
      </Section>
      <Section id="popover" title="浮层">
        <Row>
          {[false, true].map((modal) => (
            <Popover key={String(modal)} modal={modal}>
              <PopoverTrigger asChild>
                <Button variant="outline">{modal ? '打开模态浮层' : '打开浮层'}</Button>
              </PopoverTrigger>
              <PopoverContent aria-label="链接设置">
                <PopoverHeader>
                  <PopoverTitle>链接设置</PopoverTitle>
                  <PopoverDescription>填写项目地址。</PopoverDescription>
                </PopoverHeader>
                <Input className="mt-3" aria-label="项目地址" />
              </PopoverContent>
            </Popover>
          ))}
        </Row>
      </Section>
      <Section id="tooltip" title="提示">
        <TooltipProvider delayDuration={0}>
          <Row>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">显示说明</Button>
              </TooltipTrigger>
              <TooltipContent>键盘聚焦时也能查看。</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">下方提示</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">在触发项下方。</TooltipContent>
            </Tooltip>
          </Row>
        </TooltipProvider>
      </Section>
      <Section id="dropdown-menu" title="菜单">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">打开菜单</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel inset>工作区</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                打开文件<DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>离线同步</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                显示草稿
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
              <DropdownMenuRadioItem value="regular">常规视图</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dense">紧凑视图</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>导出格式</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>JSON</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">移除工作区</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>
    </>
  )
}

function Feedback() {
  return (
    <>
      <Section id="toast" title="通知">
        <Toaster
          closeButton
          richColors
          containerAriaLabel="通知"
          toastOptions={{ closeButtonAriaLabel: '关闭通知' }}
        />
        <Row>
          <Button variant="outline" onClick={() => toast('已保存')}>
            显示通知
          </Button>
          <Button variant="outline" onClick={() => toast.success('已导出')}>
            成功
          </Button>
          <Button variant="outline" onClick={() => toast.info('草稿已同步')}>
            信息
          </Button>
          <Button variant="outline" onClick={() => toast.warning('连接不稳定')}>
            提醒
          </Button>
          <Button variant="outline" onClick={() => toast.error('上传失败')}>
            错误
          </Button>
          <Button variant="outline" onClick={() => toast.loading('正在生成', { duration: 4000 })}>
            加载
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast('已移除', { action: { label: '撤销', onClick: () => toast('已恢复') } })
            }
          >
            带操作
          </Button>
        </Row>
      </Section>
      <Section id="alert" title="警示条">
        <Alert>
          <Info />
          <AlertTitle>报名已开放</AlertTitle>
          <AlertDescription>请在 11 月 20 日前提交资料。</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>提交失败</AlertTitle>
          <AlertDescription>附件超过 10 MB，请压缩后重新上传。</AlertDescription>
        </Alert>
      </Section>
      <Section id="progress" title="进度">
        <div className="grid max-w-80 gap-4">
          <Progress value={35} aria-label="上传进度" />
          <Progress value={100} aria-label="已完成" />
          <Progress value={null} aria-label="等待进度" />
        </div>
      </Section>
      <Section id="spinner" title="加载指示">
        <Row>
          <Spinner aria-label="加载中" />
          <Spinner className="size-6" aria-label="加载中（大）" />
        </Row>
      </Section>
      <Section id="empty-state" title="空状态">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Archive />
            </EmptyMedia>
            <EmptyTitle>还没有草稿</EmptyTitle>
            <EmptyDescription>新建一份草稿后会出现在这里。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => toast('已新建草稿')}>
              新建草稿
            </Button>
          </EmptyContent>
        </Empty>
        <EmptyState>没有符合条件的结果。</EmptyState>
      </Section>
      <Section id="error-state" title="错误状态">
        <ErrorState retryLabel="重试" onRetry={() => toast('已重新读取')}>
          网络连接已断开。
        </ErrorState>
        <ErrorState>这个文件已被移除。</ErrorState>
      </Section>
    </>
  )
}

function Navigation() {
  const [page, setPage] = useState(2)
  const selectPage = (event: React.MouseEvent, value: number) => {
    event.preventDefault()
    setPage(value)
  }
  return (
    <>
      <Section id="tabs" title="选项卡">
        <Tabs defaultValue="general">
          <TabsList aria-label="资料设置">
            <TabsTrigger value="general">基本</TabsTrigger>
            <TabsTrigger value="access">访问</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              禁用
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">设置工作区名称。</TabsContent>
          <TabsContent value="access">管理成员。</TabsContent>
        </Tabs>
        <Tabs defaultValue="record" orientation="vertical">
          <TabsList variant="line" aria-label="活动类型">
            <TabsTrigger value="record">记录</TabsTrigger>
            <TabsTrigger value="log">日志</TabsTrigger>
          </TabsList>
          <TabsContent value="record">最近活动。</TabsContent>
          <TabsContent value="log">操作日志。</TabsContent>
        </Tabs>
      </Section>
      <Section id="pagination" title="分页">
        <Pagination aria-label="草稿页码">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#pagination"
                aria-label="上一页"
                onClick={(event) => selectPage(event, Math.max(1, page - 1))}
              >
                上一页
              </PaginationPrevious>
            </PaginationItem>
            {[1, 2, 3].map((value) => (
              <PaginationItem key={value}>
                <PaginationLink
                  href="#pagination"
                  isActive={value === page}
                  onClick={(event) => selectPage(event, value)}
                >
                  {value}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#pagination"
                aria-label="下一页"
                onClick={(event) => selectPage(event, Math.min(3, page + 1))}
              >
                下一页
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>
      <Section id="breadcrumb" title="面包屑">
        <Breadcrumb aria-label="页面路径">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="../">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>组件预览</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>
    </>
  )
}

const avatarImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Cpath fill=%22none%22 stroke=%22currentColor%22 d=%22M10 24a6 6 0 0 1 12 0M16 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z%22/%3E%3C/svg%3E'

function Display() {
  return (
    <>
      <Section id="card" title="卡片">
        <Card className="max-w-96">
          <CardHeader>
            <CardTitle>报名进度</CardTitle>
            <CardDescription>已收到一份材料。</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" onClick={() => toast('已刷新')}>
                刷新
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={33} aria-label="报名材料进度" />
          </CardContent>
          <CardFooter className="border-t">还需提交项目说明。</CardFooter>
        </Card>
      </Section>
      <Section id="avatar" title="头像">
        <Row>
          <Avatar size="sm">
            <AvatarFallback>林</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>陈</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src={avatarImage} alt="用户头像" />
            <AvatarFallback>李</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>王</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>张</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+2</AvatarGroupCount>
          </AvatarGroup>
        </Row>
      </Section>
      <Section id="separator" title="分隔线">
        <p className="text-sm">上一区块</p>
        <Separator decorative={false} />
        <div className="flex h-6 items-center gap-3 text-sm">
          左侧
          <Separator orientation="vertical" decorative={false} />
          右侧
        </div>
      </Section>
      <Section id="table" title="表格">
        <Table>
          <TableCaption>最近两份草稿</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>草稿</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>项目说明</TableCell>
              <TableCell>待确认</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>报名资料</TableCell>
              <TableCell>已提交</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>合计</TableCell>
              <TableCell>2 份</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Section>
      <Section id="accordion" title="手风琴">
        <Accordion type="single" defaultValue="shipping" collapsible>
          <AccordionItem value="shipping">
            <AccordionTrigger>提交时间</AccordionTrigger>
            <AccordionContent>11 月 20 日 18:00 截止。</AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>联系主办方</AccordionTrigger>
            <AccordionContent>通过比赛详情页查看联系方式。</AccordionContent>
          </AccordionItem>
          <AccordionItem value="disabled" disabled>
            <AccordionTrigger>审核记录（禁用）</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </Section>
      <Section id="collapsible" title="折叠区">
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="outline">材料详情</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="py-3 text-sm">项目说明、队伍名单和源文件。</p>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible disabled>
          <CollapsibleTrigger asChild>
            <Button variant="outline">禁用的折叠区</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>审核完成后可见。</CollapsibleContent>
        </Collapsible>
      </Section>
    </>
  )
}

export function Catalog() {
  return (
    <>
      <Forms />
      <Layers />
      <Feedback />
      <Navigation />
      <Display />
    </>
  )
}
