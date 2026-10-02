import { Card } from 'journ/card'
import { Chip } from 'journ/chip'
import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { PillSelect } from 'journ/pill-select'
import { Stat } from 'journ/stat'
import { ArrowLeft } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'

const RevenuePage = (): React.ReactNode => (
	<Page.Root>
		<Page.Content>
			<PageHeader.Root>
				<IconButton tone='ghost' aria-label='Back'>
					<ArrowLeft />
				</IconButton>
				<PageHeader.Title>Revenue</PageHeader.Title>
			</PageHeader.Root>

			<div className='flex gap-2'>
				<PillSelect aria-label='Period' className='w-full'>
					<option>this week</option>
					<option>last week</option>
				</PillSelect>
				<PillSelect aria-label='Currency' className='w-full'>
					<option>USD, $</option>
					<option>BRL, R$</option>
				</PillSelect>
			</div>

			<Card.Root tone='coral'>
				<Stat.Root>
					<div className='flex items-start justify-between'>
						<Stat.Label>Gross revenue</Stat.Label>
						<Chip.Root tone='ink'>+7,5%</Chip.Root>
					</div>
					<Stat.Value>$156,900.67</Stat.Value>
				</Stat.Root>
			</Card.Root>

			<Card.Root tone='coral'>
				<Stat.Root>
					<div className='flex items-start justify-between'>
						<Stat.Label>Avg. order value</Stat.Label>
						<Chip.Root tone='ink'>+2,4%</Chip.Root>
					</div>
					<div className='flex items-end justify-between'>
						<Stat.Value>$18.50</Stat.Value>
						<Stat.Hint>Growth vs. last week</Stat.Hint>
					</div>
				</Stat.Root>
			</Card.Root>

			<BottomNav current='/journ/revenue' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default RevenuePage
