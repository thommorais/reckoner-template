import { Card } from 'journ/card'
import { Chip } from '../_components/chip'
import { ArrowButton } from '../_components/arrow-button'
import { PageTitle } from '../_components/page-title'

const CategoriesPage = (): React.ReactNode => (
	<>
		<PageTitle>Categories</PageTitle>
		<Card.Root tone='coral'>
			<Card.Title>High-volume</Card.Title>
		</Card.Root>
		<Card.Root tone='dark'>
			<Card.Title>Local spot</Card.Title>
		</Card.Root>
		<Card.Root tone='yellow'>
			<Card.Header>
				<Card.Title>Small eatery</Card.Title>
				<ArrowButton className='bg-journ-ink text-journ-paper' />
			</Card.Header>
			<Card.Footer>
				<Chip>&lt; 20 seats</Chip>
				<Chip>&lt; 5 workers</Chip>
			</Card.Footer>
		</Card.Root>
		<Card.Root tone='indigo'>
			<Card.Title>Venue capacity</Card.Title>
			<Card.Description>Weekly occupancy across locations.</Card.Description>
		</Card.Root>
		<Card.Root tone='mint'>
			<Card.Title>Operational timing</Card.Title>
		</Card.Root>
		<Card.Root tone='sky'>
			<Card.Title>Homebase</Card.Title>
			<Card.Footer>
				<Chip>Connected</Chip>
			</Card.Footer>
		</Card.Root>
	</>
)

// oxlint-disable-next-line import/no-default-export -- page
export default CategoriesPage
