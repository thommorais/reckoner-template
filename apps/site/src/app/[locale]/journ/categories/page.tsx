import { Card } from 'journ/card'
import { Chip } from 'journ/chip'
import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { Stack } from 'journ/stack'
import { ArrowLeft, Check } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'

const CategoriesPage = (): React.ReactNode => (
	<Page.Root tone='indigo'>
		<Page.Content>
			<PageHeader.Root>
				<IconButton aria-label='Back'>
					<ArrowLeft />
				</IconButton>
				<PageHeader.Title>Categories</PageHeader.Title>
			</PageHeader.Root>

			<Stack.Root defaultValue='small-eatery'>
				<Stack.Item value='high-volume' tone='coral'>
					<Stack.Trigger>High-volume</Stack.Trigger>
					<Stack.Content>
						<Card.Description>Busy venues with fast table turnover.</Card.Description>
						<Card.Footer>
							<Chip.Root>
								<Chip.Dot className='text-journ-coral' />
								&gt; 100 seats
							</Chip.Root>
							<Chip.Root>
								<Chip.Dot className='text-journ-indigo' />
								&gt; 75 workers
							</Chip.Root>
						</Card.Footer>
					</Stack.Content>
				</Stack.Item>
				<Stack.Item value='local-spot' tone='surface'>
					<Stack.Trigger>Local spot</Stack.Trigger>
					<Stack.Content>
						<Card.Description>Neighborhood places with regulars.</Card.Description>
						<Card.Footer>
							<Chip.Root tone='dim'>&lt; 40 seats</Chip.Root>
							<Chip.Root tone='dim'>&lt; 10 workers</Chip.Root>
						</Card.Footer>
					</Stack.Content>
				</Stack.Item>
				<Stack.Item value='small-eatery' tone='yellow'>
					<Stack.Trigger>Small eatery</Stack.Trigger>
					<Stack.Content>
						<Card.Footer>
							<Chip.Root>
								<Chip.Dot className='text-journ-coral' />
								&lt; 20 seats
							</Chip.Root>
							<Chip.Root>
								<Chip.Dot className='text-journ-indigo' />
								&lt; 5 workers
							</Chip.Root>
						</Card.Footer>
					</Stack.Content>
				</Stack.Item>
			</Stack.Root>

			<h2 className='font-journ-display text-3xl/none font-semibold uppercase'>Integrations</h2>
			<Card.Root tone='coral' className='-rotate-3'>
				<Card.Title>Quickbooks</Card.Title>
				<Card.Footer>
					<Chip.Root tone='ink'>Unconnected</Chip.Root>
				</Card.Footer>
			</Card.Root>
			<Card.Root tone='yellow'>
				<Card.Title>Xero</Card.Title>
				<Card.Footer>
					<Chip.Root>
						<Check className='size-3' />
						Connected
					</Chip.Root>
				</Card.Footer>
			</Card.Root>
			<Card.Root tone='sky' className='rotate-3'>
				<Card.Title>Homebase</Card.Title>
				<Card.Footer>
					<Chip.Root>
						<Check className='size-3' />
						Connected
					</Chip.Root>
				</Card.Footer>
			</Card.Root>

			<BottomNav current='/journ/categories' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default CategoriesPage
