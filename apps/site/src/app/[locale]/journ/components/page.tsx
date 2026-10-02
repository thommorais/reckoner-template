import { Accordion } from 'journ/accordion'
import { Avatar } from 'journ/avatar'
import { Button } from 'journ/button'
import { Card } from 'journ/card'
import { Checkbox } from 'journ/checkbox'
import { Composer } from 'journ/composer'
import { Divider } from 'journ/divider'
import { DropdownMenu } from 'journ/dropdown-menu'
import { Field } from 'journ/field'
import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { Popover } from 'journ/popover'
import { Progress } from 'journ/progress'
import { Radio } from 'journ/radio'
import { Select } from 'journ/select'
import { Switch } from 'journ/switch'
import { Tabs } from 'journ/tabs'
import { Tooltip } from 'journ/tooltip'
import { ArrowLeft, Ellipsis, Info } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'
import { DialogExample } from '../_components/dialog-example'

const avatarImage =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%23f2705a'/><circle cx='20' cy='16' r='7' fill='%23fff3d6'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23fff3d6'/></svg>"

const ComponentsPage = (): React.ReactNode => (
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
					<Progress value={72} aria-label='Coral' />
					<Progress value={45} tone='yellow' aria-label='Yellow' />
					<Progress value={90} tone='mint' aria-label='Mint' />
					<Progress value={20} tone='sky' aria-label='Sky' />
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
						<Switch defaultChecked />
					</label>
					<label className='flex items-center justify-between gap-3 text-sm'>
						Weekly digest
						<Switch />
					</label>
					<label className='flex items-center justify-between gap-3 text-sm opacity-60'>
						Beta features (disabled)
						<Switch disabled />
					</label>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Title>Checkbox</Card.Title>
				<Card.Content className='gap-3'>
					<label className='flex items-center gap-3 text-sm'>
						<Checkbox defaultChecked />
						P&amp;L statement
					</label>
					<label className='flex items-center gap-3 text-sm'>
						<Checkbox />
						Management
					</label>
					<label className='flex items-center gap-3 text-sm'>
						<Checkbox checked='indeterminate' />
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

			<BottomNav current='/journ/components' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default ComponentsPage
