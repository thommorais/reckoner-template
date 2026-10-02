import { Card } from 'journ/card'
import { Chip } from '../_components/chip'
import { PageTitle } from '../_components/page-title'

const days = [
	{ day: 'Mon', value: 48 },
	{ day: 'Tue', value: 100 },
	{ day: 'Wen', value: 62 },
	{ day: 'Thu', value: 70 },
	{ day: 'Fri', value: 44 },
	{ day: 'Sat', value: 58 },
	{ day: 'Sun', value: 64 },
] as const

const RevenuePage = (): React.ReactNode => (
	<>
		<PageTitle>Revenue</PageTitle>
		<Card.Root tone='coral'>
			<Card.Header>
				<Card.Title>Gross revenue</Card.Title>
				<Chip className='bg-journ-ink text-journ-paper'>+7,5%</Chip>
			</Card.Header>
			<Card.Content>
				<p className='font-journ-display text-5xl/none font-semibold'>$156,900.67</p>
			</Card.Content>
		</Card.Root>
		<Card.Root tone='coral'>
			<Card.Header>
				<Card.Title>Avg. order value</Card.Title>
				<Chip className='bg-journ-ink text-journ-paper'>+2,4%</Chip>
			</Card.Header>
			<Card.Content className='flex-row items-end justify-between'>
				<p className='font-journ-display text-5xl/none font-semibold'>$18.50</p>
				<Card.Description>Growth vs. last week</Card.Description>
			</Card.Content>
		</Card.Root>
		<Card.Root tone='coral'>
			<Card.Content className='h-48 flex-row items-end gap-2'>
				{days.map(({ day, value }) => (
					<div key={day} className='flex h-full flex-1 flex-col items-center justify-end gap-2'>
						<div
							className={`w-full rounded-full ${value === 100 ? 'bg-journ-mint' : 'bg-journ-paper/40'}`}
							style={{ height: `${value}%` }}
						/>
						<span className='font-mono text-xs'>{day}</span>
					</div>
				))}
			</Card.Content>
		</Card.Root>
	</>
)

// oxlint-disable-next-line import/no-default-export -- page
export default RevenuePage
