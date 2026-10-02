import { Card } from 'journ/card'
import { Chip } from 'journ/chip'
import { IconButton } from 'journ/icon-button'
import { PageHeader } from 'journ/page-header'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'

const CategoriesPage = (): React.ReactNode => (
	<>
		<PageHeader.Root>
			<IconButton aria-label='Back'>
				<ArrowLeft />
			</IconButton>
			<PageHeader.Title>Categories</PageHeader.Title>
		</PageHeader.Root>

		<div className='flex flex-col'>
			<Card.Root tone='coral' className='pb-8'>
				<Card.Title>High-volume</Card.Title>
			</Card.Root>
			<Card.Root tone='dark' className='-mt-6 pb-8'>
				<Card.Title>Local spot</Card.Title>
			</Card.Root>
			<Card.Root tone='yellow' className='-mt-6'>
				<Card.Header>
					<Card.Title>Small eatery</Card.Title>
					<IconButton tone='ink' size='sm' aria-label='Open'>
						<ArrowUpRight />
					</IconButton>
				</Card.Header>
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
			</Card.Root>
		</div>

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
	</>
)

// oxlint-disable-next-line import/no-default-export -- page
export default CategoriesPage
