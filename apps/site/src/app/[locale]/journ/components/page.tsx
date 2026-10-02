import { Accordion } from 'journ/accordion'
import { Avatar } from 'journ/avatar'
import { Button } from 'journ/button'
import { Card } from 'journ/card'
import { Collapsible } from 'journ/collapsible'
import { ContextMenu } from 'journ/context-menu'
import { Checkbox } from 'journ/checkbox'
import { Composer } from 'journ/composer'
import { Divider } from 'journ/divider'
import { DropdownMenu } from 'journ/dropdown-menu'
import { Field } from 'journ/field'
import { HoverCard } from 'journ/hover-card'
import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { Popover } from 'journ/popover'
import { Progress } from 'journ/progress'
import { Radio } from 'journ/radio'
import { ScrollArea } from 'journ/scroll-area'
import { Markdown } from 'journ/markdown'
import { MonthStepper } from 'journ/month-stepper'
import { Select } from 'journ/select'
import { Slider } from 'journ/slider'
import { Stepper } from 'journ/stepper'
import { Switch } from 'journ/switch'
import { Tabs } from 'journ/tabs'
import { ToggleGroup } from 'journ/toggle-group'
import { Tooltip } from 'journ/tooltip'
import { ArrowLeft, CalendarDays, ChevronDown, Ellipsis, Info, List } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'
import { BulkDemo } from '../_components/bulk-demo'
import { ConfirmDemo } from '../_components/confirm-demo'
import { DateInputDemo, DropzoneDemo, OtpDemo } from '../_components/form-demos'
import { DialogExample } from '../_components/dialog-example'
import { PickerDemo } from '../_components/picker-demo'

const notes = `## Prime cost

Labor is **28%** of revenue, 3 points above target.

- Approve the open alerts
- Check inventory risk

> Shift ends in 2:59:12 hours.

Read the [component guide](/journ/components) or run \`pnpm dev\`.`

const avatarImage =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%23f2705a'/><circle cx='20' cy='16' r='7' fill='%23fff3d6'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23fff3d6'/></svg>"

const ComponentsPage = async ({ params }: { params: Promise<{ locale: string }> }): Promise<React.ReactNode> => {
	const { locale } = await params

	return (
		<Page.Root tone='ink'>
			<Page.Content>
				<PageHeader.Root>
					<IconButton tone='ghost' aria-label='Back'>
						<ArrowLeft />
					</IconButton>
					<PageHeader.Title>Components</PageHeader.Title>
				</PageHeader.Root>

				<Card.Root>
					<Card.Title>Avatar</Card.Title>
					<Card.Content className='flex-row items-center gap-3'>
						<Avatar.Root>
							<Avatar.Image src={avatarImage} alt='Hanna' />
							<Avatar.Fallback>H</Avatar.Fallback>
						</Avatar.Root>
						<Avatar.Root>
							<Avatar.Image src='/missing.png' alt='Missing' />
							<Avatar.Fallback>MS</Avatar.Fallback>
						</Avatar.Root>
						<Avatar.Root className='bg-journ-coral size-14'>
							<Avatar.Fallback>AI</Avatar.Fallback>
						</Avatar.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Progress</Card.Title>
					<Card.Content className='gap-4'>
						<Progress.Root value={72} aria-label='Coral'>
							<Progress.Indicator />
						</Progress.Root>
						<Progress.Root value={45} aria-label='Yellow'>
							<Progress.Indicator tone='yellow' />
						</Progress.Root>
						<Progress.Root value={90} aria-label='Mint'>
							<Progress.Indicator tone='mint' />
						</Progress.Root>
						<Progress.Root value={20} aria-label='Sky'>
							<Progress.Indicator tone='sky' />
						</Progress.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Divider</Card.Title>
					<Card.Content className='gap-3'>
						<p className='text-sm'>Above</p>
						<Divider />
						<p className='text-sm'>Below</p>
						<div className='flex h-6 items-center gap-3 text-sm'>
							<span>One</span>
							<Divider orientation='vertical' />
							<span>Two</span>
							<Divider orientation='vertical' />
							<span>Three</span>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Field</Card.Title>
					<Card.Content className='gap-4'>
						<Field.Root>
							<Field.Label>Email</Field.Label>
							<Field.Control>
								<Composer.Root>
									<Composer.Input type='email' placeholder='hanna@thedailygrind.com' />
								</Composer.Root>
							</Field.Control>
							<Field.Description>We only use it for report alerts.</Field.Description>
						</Field.Root>
						<Field.Root invalid>
							<Field.Label>Location</Field.Label>
							<Field.Control>
								<Composer.Root>
									<Composer.Input placeholder='The Daily Grind, NY' />
								</Composer.Root>
							</Field.Control>
							<Field.Description>The venue this report belongs to.</Field.Description>
							<Field.Error>Pick a location.</Field.Error>
						</Field.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Dialog</Card.Title>
					<Card.Content>
						<DialogExample />
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Switch</Card.Title>
					<Card.Content className='gap-3'>
						<label className='flex items-center justify-between gap-3 text-sm'>
							Labor cost alerts
							<Switch.Root defaultChecked>
								<Switch.Thumb />
							</Switch.Root>
						</label>
						<label className='flex items-center justify-between gap-3 text-sm'>
							Weekly digest
							<Switch.Root>
								<Switch.Thumb />
							</Switch.Root>
						</label>
						<label className='flex items-center justify-between gap-3 text-sm opacity-60'>
							Beta features (disabled)
							<Switch.Root disabled>
								<Switch.Thumb />
							</Switch.Root>
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Checkbox</Card.Title>
					<Card.Content className='gap-3'>
						<label className='flex items-center gap-3 text-sm'>
							<Checkbox.Root defaultChecked>
								<Checkbox.Indicator />
							</Checkbox.Root>
							P&amp;L statement
						</label>
						<label className='flex items-center gap-3 text-sm'>
							<Checkbox.Root>
								<Checkbox.Indicator />
							</Checkbox.Root>
							Management
						</label>
						<label className='flex items-center gap-3 text-sm'>
							<Checkbox.Root checked='indeterminate'>
								<Checkbox.Indicator />
							</Checkbox.Root>
							Some venues
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Radio</Card.Title>
					<Radio.Group defaultValue='week' aria-label='Period'>
						<label className='flex items-center gap-3 text-sm'>
							<Radio.Item value='week' />
							This week
						</label>
						<label className='flex items-center gap-3 text-sm'>
							<Radio.Item value='month' />
							This month
						</label>
						<label className='flex items-center gap-3 text-sm opacity-60'>
							<Radio.Item value='year' disabled />
							This year (disabled)
						</label>
					</Radio.Group>
				</Card.Root>

				<Card.Root>
					<Card.Title>Tabs</Card.Title>
					<Tabs.Root defaultValue='day'>
						<Tabs.List>
							<Tabs.Trigger value='day'>Day</Tabs.Trigger>
							<Tabs.Trigger value='week'>Week</Tabs.Trigger>
							<Tabs.Trigger value='month'>Month</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value='day'>
							<Card.Description>Revenue so far today.</Card.Description>
						</Tabs.Content>
						<Tabs.Content value='week'>
							<Card.Description>Revenue for the current week.</Card.Description>
						</Tabs.Content>
						<Tabs.Content value='month'>
							<Card.Description>Revenue for the current month.</Card.Description>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Select</Card.Title>
					<Select.Root defaultValue='week'>
						<Select.Trigger aria-label='Period' className='self-start'>
							<Select.Value placeholder='Pick a period' />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Period</Select.Label>
								<Select.Item value='week'>This week</Select.Item>
								<Select.Item value='month'>This month</Select.Item>
							</Select.Group>
							<Select.Separator />
							<Select.Item value='year' disabled>
								This year
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Dropdown menu</Card.Title>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<Button className='self-start'>
								<Ellipsis />
								Actions
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align='start'>
							<DropdownMenu.Label>Prime cost report</DropdownMenu.Label>
							<DropdownMenu.Item>Rename</DropdownMenu.Item>
							<DropdownMenu.Item>Duplicate</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Tooltip and popover</Card.Title>
					<Card.Content className='flex-row items-center gap-3'>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<IconButton tone='ghost' aria-label='Info'>
									<Info />
								</IconButton>
							</Tooltip.Trigger>
							<Tooltip.Content>Cost of goods sold plus labor</Tooltip.Content>
						</Tooltip.Root>
						<Popover.Root>
							<Popover.Trigger asChild>
								<Button tone='outline'>Details</Button>
							</Popover.Trigger>
							<Popover.Content>
								<p className='font-journ-display text-2xl/none font-semibold uppercase'>Prime cost</p>
								<p className='text-sm/5 opacity-70'>Updated every night from your POS and payroll.</p>
								<Popover.Close asChild>
									<Button className='self-end'>Got it</Button>
								</Popover.Close>
							</Popover.Content>
						</Popover.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Accordion</Card.Title>
					<Accordion.Root type='single' collapsible defaultValue='labor'>
						<Accordion.Item value='labor'>
							<Accordion.Trigger>Labor cost</Accordion.Trigger>
							<Accordion.Content>Labor is 28% of revenue this week, 3 points above target.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='aov'>
							<Accordion.Trigger>Average order value</Accordion.Trigger>
							<Accordion.Content>AOV is $18.50, up 2,4% versus last week.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='inventory'>
							<Accordion.Trigger>Inventory risk</Accordion.Trigger>
							<Accordion.Content>Two items will run out before the next delivery.</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Scroll area</Card.Title>
					<ScrollArea.Root type='always' className='h-40 rounded-2xl bg-current/10'>
						<ScrollArea.Viewport>
							<ul className='flex flex-col gap-2 p-3 text-sm'>
								{Array.from({ length: 12 }, (_, index) => (
									<li key={index} className='rounded-xl bg-current/10 px-3 py-2'>
										Report {index + 1}
									</li>
								))}
							</ul>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar />
					</ScrollArea.Root>
					<Card.Description>Native container with the scrollbar-journ utility:</Card.Description>
					<ul className='scrollbar-journ flex h-32 flex-col gap-2 overflow-y-auto rounded-2xl bg-current/10 p-3 text-sm'>
						{Array.from({ length: 12 }, (_, index) => (
							<li key={index} className='rounded-xl bg-current/10 px-3 py-2'>
								Venue {index + 1}
							</li>
						))}
					</ul>
				</Card.Root>

				<Card.Root>
					<Card.Title>Alert dialog</Card.Title>
					<ConfirmDemo />
				</Card.Root>

				<Card.Root>
					<Card.Title>Toggle group</Card.Title>
					<ToggleGroup.Root type='single' defaultValue='list' aria-label='View' className='self-start'>
						<ToggleGroup.Item value='list'>
							<List />
							List
						</ToggleGroup.Item>
						<ToggleGroup.Item value='calendar'>
							<CalendarDays />
							Calendar
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Slider</Card.Title>
					<Card.Content className='gap-4'>
						<Slider.Root defaultValue={[40]}>
							<Slider.Track>
								<Slider.Range />
							</Slider.Track>
							<Slider.Thumb aria-label='Budget' />
						</Slider.Root>
						<Slider.Root defaultValue={[20, 75]}>
							<Slider.Track>
								<Slider.Range />
							</Slider.Track>
							<Slider.Thumb aria-label='Minimum price' />
							<Slider.Thumb aria-label='Maximum price' />
						</Slider.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Title>Collapsible and hover card</Card.Title>
					<Collapsible.Root>
						<Collapsible.Trigger className='flex w-full items-center justify-between gap-3 text-sm font-medium'>
							Show filters
							<ChevronDown className='size-4' />
						</Collapsible.Trigger>
						<Collapsible.Content>
							<Card.Description>Venue, period and currency filters live here.</Card.Description>
						</Collapsible.Content>
					</Collapsible.Root>
					<Divider />
					<p className='text-sm'>
						Owned by{' '}
						<HoverCard.Root>
							<HoverCard.Trigger href='#' className='underline underline-offset-4'>
								Hanna
							</HoverCard.Trigger>
							<HoverCard.Content>
								<p className='font-journ-display text-2xl/none font-semibold uppercase'>Hanna</p>
								<p className='text-sm/5 opacity-70'>Revenue lead at The Daily Grind, NY.</p>
							</HoverCard.Content>
						</HoverCard.Root>
					</p>
				</Card.Root>

				<Card.Root>
					<Card.Title>Bulk bar</Card.Title>
					<BulkDemo />
				</Card.Root>

				<Card.Root>
					<Card.Title>Context menu</Card.Title>
					<ContextMenu.Root>
						<ContextMenu.Trigger asChild>
							<div className='grid h-24 place-items-center rounded-2xl border border-dashed border-current/25 text-sm opacity-80 select-none'>
								Right click or long press here
							</div>
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Label>Prime cost report</ContextMenu.Label>
							<ContextMenu.Item>Rename</ContextMenu.Item>
							<ContextMenu.Item>Duplicate</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item disabled>Delete</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Month stepper</Card.Title>
					<MonthStepper.Root defaultValue={new Date(2026, 9, 1)} locale={locale} className='self-start'>
						<MonthStepper.Previous />
						<MonthStepper.Label />
						<MonthStepper.Next />
					</MonthStepper.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>Date input</Card.Title>
					<DateInputDemo locale={locale} />
				</Card.Root>

				<Card.Root>
					<Card.Title>OTP input</Card.Title>
					<OtpDemo />
				</Card.Root>

				<Card.Root>
					<Card.Title>Stepper</Card.Title>
					<Stepper.Root value={2} aria-label='Connect a bank'>
						<Stepper.Item step={1}>
							<Stepper.Indicator />
							<div>
								<Stepper.Label>Choose bank</Stepper.Label>
								<Stepper.Description>Nubank</Stepper.Description>
							</div>
						</Stepper.Item>
						<Stepper.Item step={2}>
							<Stepper.Indicator />
							<div>
								<Stepper.Label>Authorize</Stepper.Label>
								<Stepper.Description>Approve in your app</Stepper.Description>
							</div>
						</Stepper.Item>
						<Stepper.Item step={3}>
							<Stepper.Indicator />
							<div>
								<Stepper.Label>Import</Stepper.Label>
								<Stepper.Description>Last 90 days</Stepper.Description>
							</div>
						</Stepper.Item>
					</Stepper.Root>
				</Card.Root>

				<Card.Root>
					<Card.Title>File dropzone</Card.Title>
					<DropzoneDemo />
				</Card.Root>

				<Card.Root>
					<Card.Title>Markdown</Card.Title>
					<Markdown>{notes}</Markdown>
				</Card.Root>

				<PickerDemo locale={locale} />

				<BottomNav current='/journ/components' />
			</Page.Content>
		</Page.Root>
	)
}

// oxlint-disable-next-line import/no-default-export -- page
export default ComponentsPage
