import { Card } from 'journ/card'
import { FileText } from 'lucide-react'
import { ArrowButton } from '../_components/arrow-button'
import { Chip } from '../_components/chip'
import { PageTitle } from '../_components/page-title'

const reports = [
	{
		id: 'prime-cost',
		title: 'Prime cost report',
		description: 'The Cost of Goods Sold (Food & Beverage Cost) and labor, week over week.',
		tags: ['P&L Statement', 'Management'],
	},
	{
		id: 'menu-mix',
		title: 'Menu mix',
		description: 'Items ranked by units sold and contribution margin.',
		tags: ['Menu'],
	},
	{
		id: 'labor',
		title: 'Stabilizing labor cost',
		description: 'Approve critical alerts and check inventory risk. Shift ends in 2:59:12 hours.',
		tags: ['Labor', 'Alerts'],
	},
] as const

const ReportsPage = (): React.ReactNode => (
	<>
		<PageTitle>Reports</PageTitle>
		<p className='font-mono text-xs opacity-60'>{reports.length} reports found</p>
		{reports.map(report => (
			<Card.Root key={report.id} tone='dark' className='bg-journ-paper/10'>
				<Card.Header>
					<div className='flex items-start gap-3'>
						<span className='bg-journ-coral text-journ-ink grid size-11 shrink-0 place-items-center rounded-2xl'>
							<FileText className='size-5' />
						</span>
						<Card.Title>{report.title}</Card.Title>
					</div>
					<ArrowButton />
				</Card.Header>
				<Card.Content>
					<Card.Description>{report.description}</Card.Description>
				</Card.Content>
				<Card.Footer>
					{report.tags.map(tag => (
						<Chip key={tag} className='bg-journ-paper/10 text-journ-yellow'>
							{tag}
						</Chip>
					))}
				</Card.Footer>
			</Card.Root>
		))}
	</>
)

// oxlint-disable-next-line import/no-default-export -- page
export default ReportsPage
