import { Avatar } from 'journ/avatar'
import { Button } from 'journ/button'
import { Card } from 'journ/card'
import { Chip } from 'journ/chip'
import { Composer } from 'journ/composer'
import { IconButton } from 'journ/icon-button'
import { Message } from 'journ/message'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { PillSelect } from 'journ/pill-select'
import { ArrowUpRight, Bell, Plus, Search, ShieldAlert } from 'lucide-react'
import { BottomNav } from './_components/bottom-nav'
import { ToastDemo } from './_components/toast-demo'

const JournHome = (): React.ReactNode => (
	<Page.Root tone='ink'>
		<Page.Content>
			<PageHeader.Root>
				<Avatar.Root>
					<Avatar.Fallback>H</Avatar.Fallback>
				</Avatar.Root>
				<PageHeader.Title className='text-base font-normal normal-case'>Hi, Hanna!</PageHeader.Title>
				<PageHeader.Actions>
					<IconButton aria-label='Search'>
						<Search />
					</IconButton>
					<IconButton aria-label='Notifications'>
						<Bell />
					</IconButton>
				</PageHeader.Actions>
			</PageHeader.Root>

			<PillSelect aria-label='Location' className='w-full'>
				<option>The Daily Grind, NY</option>
				<option>Long Island City</option>
			</PillSelect>

			<Card.Root>
				<Card.Header>
					<div className='flex items-start gap-3'>
						<Card.Icon>
							<ShieldAlert />
						</Card.Icon>
						<div className='flex flex-col gap-1'>
							<Card.Title className='text-2xl'>Stabilizing labor cost</Card.Title>
							<Card.Description>
								Approve critical alerts and check inventory risk. Shift ends in 2:59:12 hours.
							</Card.Description>
						</div>
					</div>
					<IconButton aria-label='Open' size='sm'>
						<ArrowUpRight />
					</IconButton>
				</Card.Header>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>AI operations lead</Card.Title>
					<IconButton aria-label='Open' size='sm'>
						<ArrowUpRight />
					</IconButton>
				</Card.Header>
				<Card.Content className='gap-4'>
					<Message.Root>
						<Avatar.Root className='size-8'>
							<Avatar.Fallback>AI</Avatar.Fallback>
						</Avatar.Root>
						<Message.Bubble>
							Hi, Hanna, <Message.Highlight>The Daily Grind</Message.Highlight> shows strong revenue, but two flags need
							attention: AOV is dipping and Labor Cost is <Message.Highlight>28%</Message.Highlight>. Let's initiate the
							optimization strategy.
						</Message.Bubble>
					</Message.Root>
					<Message.Root from='user'>
						<Message.Bubble>Show labor cost</Message.Bubble>
					</Message.Root>
					<Chip.Root tone='dim' className='self-end'>
						Initiate strategy planning
					</Chip.Root>
				</Card.Content>
				<Composer.Root>
					<IconButton tone='coral' aria-label='New'>
						<Plus />
					</IconButton>
					<Composer.Input placeholder='Ask something to start' />
				</Composer.Root>
			</Card.Root>

			<div className='flex gap-2'>
				<ToastDemo />
				<Button href='/journ/components' tone='ghost'>
					Components
				</Button>
				<Button href='/journ/web' tone='ghost'>
					Web
				</Button>
			</div>
			<BottomNav current='/journ' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default JournHome
