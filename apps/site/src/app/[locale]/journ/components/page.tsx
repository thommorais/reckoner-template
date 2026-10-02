import { Avatar } from 'journ/avatar'
import { Card } from 'journ/card'
import { Composer } from 'journ/composer'
import { Divider } from 'journ/divider'
import { Field } from 'journ/field'
import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { Progress } from 'journ/progress'
import { ArrowLeft } from 'lucide-react'
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

			<BottomNav current='/journ/components' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default ComponentsPage
