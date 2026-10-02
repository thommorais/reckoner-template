import { Button } from 'journ/button'
import { Card } from 'journ/card'
import { Chip } from 'journ/chip'
import { Composer } from 'journ/composer'
import { Drawer } from 'journ/drawer'
import { IconButton } from 'journ/icon-button'
import { PageHeader } from 'journ/page-header'
import { PillSelect } from 'journ/pill-select'
import { ArrowLeft, ArrowUpRight, FileText, Search } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'

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
		<PageHeader.Root>
			<IconButton tone='ghost' aria-label='Back'>
				<ArrowLeft />
			</IconButton>
			<PageHeader.Title>Reports</PageHeader.Title>
			<PillSelect aria-label='Filter'>
				<option>all</option>
				<option>finance</option>
			</PillSelect>
		</PageHeader.Root>

		<Composer.Root>
			<Search className='ml-3 size-4 opacity-60' />
			<Composer.Input placeholder='Search by name or type' />
		</Composer.Root>

		<p className='font-mono text-xs opacity-60'>{reports.length} reports found</p>

		{reports.map(report => (
			<Card.Root key={report.id}>
				<Card.Header>
					<div className='flex items-start gap-3'>
						<Card.Icon className='bg-journ-coral'>
							<FileText />
						</Card.Icon>
						<Card.Title>{report.title}</Card.Title>
					</div>
					<Drawer.Root>
						<Drawer.Trigger asChild>
							<IconButton aria-label='Open' size='sm'>
								<ArrowUpRight />
							</IconButton>
						</Drawer.Trigger>
						<Drawer.Content>
							<Drawer.Title>{report.title}</Drawer.Title>
							<Drawer.Description>{report.description}</Drawer.Description>
							<Drawer.Body>
								<div className='flex flex-wrap gap-2'>
									{report.tags.map(tag => (
										<Chip.Root key={tag} tone='dim'>
											{tag}
										</Chip.Root>
									))}
								</div>
							</Drawer.Body>
							<Drawer.Actions>
								<Drawer.Close asChild>
									<Button>Close</Button>
								</Drawer.Close>
							</Drawer.Actions>
						</Drawer.Content>
					</Drawer.Root>
				</Card.Header>
				<Card.Content>
					<Card.Description>{report.description}</Card.Description>
				</Card.Content>
				<Card.Footer>
					{report.tags.map(tag => (
						<Chip.Root key={tag} tone='dim'>
							{tag}
						</Chip.Root>
					))}
				</Card.Footer>
			</Card.Root>
		))}

		<BottomNav current='/journ/reports' />
	</>
)

// oxlint-disable-next-line import/no-default-export -- page
export default ReportsPage
