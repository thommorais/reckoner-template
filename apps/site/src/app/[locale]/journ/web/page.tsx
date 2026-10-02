import { Alert } from 'journ/alert'
import { Avatar } from 'journ/avatar'
import { Badge } from 'journ/badge'
import { Breadcrumbs } from 'journ/breadcrumbs'
import { Button } from 'journ/button'
import { Card } from 'journ/card'
import { DescriptionList } from 'journ/description-list'
import { EmptyState } from 'journ/empty-state'
import { Field } from 'journ/field'
import { Heading } from 'journ/heading'
import { Icon } from 'journ/icon'
import { Input } from 'journ/input'
import { Link } from 'journ/link'
import { Page } from 'journ/page'
import { Pagination } from 'journ/pagination'
import { Sidebar } from 'journ/sidebar'
import { Skeleton } from 'journ/skeleton'
import { Spinner } from 'journ/spinner'
import { Table } from 'journ/table'
import { Text } from 'journ/text'
import { Textarea } from 'journ/textarea'
import { FileSearch, FileText, Home, LineChart, Settings, ShieldAlert } from 'lucide-react'

const reports = [
	{ name: 'Prime cost report', owner: 'Hanna', status: 'Ready', tone: 'mint', updated: 'Today' },
	{ name: 'Menu mix', owner: 'Sarah', status: 'Draft', tone: 'yellow', updated: 'Yesterday' },
	{ name: 'Stabilizing labor cost', owner: 'Michael', status: 'Flagged', tone: 'coral', updated: '2 days ago' },
	{ name: 'Weekly revenue', owner: 'Hanna', status: 'Ready', tone: 'mint', updated: 'Last week' },
] as const

const WebPage = (): React.ReactNode => (
	<Page.Root tone='ink'>
		<Sidebar.Layout>
			<Sidebar.Root className='hidden lg:flex'>
				<Sidebar.Header>
					<Avatar.Root>
						<Avatar.Fallback>DG</Avatar.Fallback>
					</Avatar.Root>
					<Heading level={2} size='sm'>
						The Daily Grind
					</Heading>
				</Sidebar.Header>
				<Sidebar.Body>
					<Sidebar.Section>
						<Sidebar.Heading>Overview</Sidebar.Heading>
						<Sidebar.Item href='/journ/web' aria-current='page'>
							<Home />
							Dashboard
						</Sidebar.Item>
						<Sidebar.Item href='/journ/revenue'>
							<LineChart />
							Revenue
						</Sidebar.Item>
						<Sidebar.Item href='/journ/reports'>
							<FileText />
							Reports
						</Sidebar.Item>
					</Sidebar.Section>
					<Sidebar.Section>
						<Sidebar.Heading>Account</Sidebar.Heading>
						<Sidebar.Item href='/journ/components'>
							<Settings />
							Components
						</Sidebar.Item>
					</Sidebar.Section>
				</Sidebar.Body>
				<Sidebar.Footer>
					<Avatar.Root className='size-8'>
						<Avatar.Fallback>H</Avatar.Fallback>
					</Avatar.Root>
					<Text size='sm'>Hanna</Text>
				</Sidebar.Footer>
			</Sidebar.Root>

			<Sidebar.Content className='flex flex-col gap-6'>
				<Breadcrumbs.Root>
					<Breadcrumbs.List>
						<Breadcrumbs.Item>
							<Breadcrumbs.Link href='/journ'>Journ</Breadcrumbs.Link>
						</Breadcrumbs.Item>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Item>
							<Breadcrumbs.Link href='/journ/web'>Dashboard</Breadcrumbs.Link>
						</Breadcrumbs.Item>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Item>
							<Breadcrumbs.Page>Reports</Breadcrumbs.Page>
						</Breadcrumbs.Item>
					</Breadcrumbs.List>
				</Breadcrumbs.Root>

				<div className='flex flex-col gap-2'>
					<Heading size='xl'>Reports</Heading>
					<Text tone='muted' className='max-w-prose'>
						Everything your team tracks for The Daily Grind. Read the{' '}
						<Link href='/journ/components'>component guide</Link> to see how each piece is built.
					</Text>
				</div>

				<Alert.Root tone='yellow'>
					<Alert.Icon>
						<ShieldAlert />
					</Alert.Icon>
					<Alert.Body>
						<Alert.Title>Labor cost needs attention</Alert.Title>
						<Alert.Description>
							Labor is 28% of revenue, 3 points above target. Approve the open alerts.
						</Alert.Description>
						<Alert.Actions>
							<Button tone='ink'>Review alerts</Button>
						</Alert.Actions>
					</Alert.Body>
				</Alert.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>All reports</Card.Title>
						<Badge tone='sky'>{reports.length}</Badge>
					</Card.Header>
					<Table.Root>
						<Table.Caption>Sorted by last update</Table.Caption>
						<Table.Head>
							<Table.Row>
								<Table.Header>Name</Table.Header>
								<Table.Header>Owner</Table.Header>
								<Table.Header>Status</Table.Header>
								<Table.Header>Updated</Table.Header>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{reports.map(report => (
								<Table.Row key={report.name}>
									<Table.Cell className='font-medium'>{report.name}</Table.Cell>
									<Table.Cell>{report.owner}</Table.Cell>
									<Table.Cell>
										<Badge tone={report.tone}>{report.status}</Badge>
									</Table.Cell>
									<Table.Cell className='opacity-70'>{report.updated}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
					<Pagination.Root>
						<Pagination.Previous href='#' aria-disabled />
						<Pagination.List>
							<Pagination.Page href='#' aria-current='page'>
								1
							</Pagination.Page>
							<Pagination.Page href='#'>2</Pagination.Page>
							<Pagination.Page href='#'>3</Pagination.Page>
							<Pagination.Gap />
							<Pagination.Page href='#'>9</Pagination.Page>
						</Pagination.List>
						<Pagination.Next href='#' />
					</Pagination.Root>
				</Card.Root>

				<div className='grid gap-6 lg:grid-cols-2'>
					<Card.Root>
						<Card.Title>Report details</Card.Title>
						<DescriptionList.Root>
							<DescriptionList.Term>Name</DescriptionList.Term>
							<DescriptionList.Details>Prime cost report</DescriptionList.Details>
							<DescriptionList.Term>Owner</DescriptionList.Term>
							<DescriptionList.Details>Hanna</DescriptionList.Details>
							<DescriptionList.Term>Venue</DescriptionList.Term>
							<DescriptionList.Details>The Daily Grind, NY</DescriptionList.Details>
							<DescriptionList.Term>Tags</DescriptionList.Term>
							<DescriptionList.Details className='flex gap-1'>
								<Badge tone='yellow'>P&amp;L</Badge>
								<Badge tone='indigo'>Management</Badge>
							</DescriptionList.Details>
						</DescriptionList.Root>
					</Card.Root>

					<Card.Root>
						<Card.Title>New report</Card.Title>
						<Card.Content className='gap-4'>
							<Field.Root>
								<Field.Label>Name</Field.Label>
								<Field.Control>
									<Input placeholder='Prime cost report' />
								</Field.Control>
							</Field.Root>
							<Field.Root>
								<Field.Label>Notes</Field.Label>
								<Field.Control>
									<Textarea placeholder='What should the team know?' />
								</Field.Control>
								<Field.Description>Shown at the top of the report.</Field.Description>
							</Field.Root>
							<Field.Root invalid>
								<Field.Label>Venue</Field.Label>
								<Field.Control>
									<Input placeholder='The Daily Grind, NY' />
								</Field.Control>
								<Field.Error>Pick a venue.</Field.Error>
							</Field.Root>
							<Button tone='coral' className='self-start'>
								Create report
							</Button>
						</Card.Content>
					</Card.Root>
				</div>

				<div className='grid gap-6 lg:grid-cols-2'>
					<Card.Root>
						<Card.Title>Loading</Card.Title>
						<Card.Content className='gap-3'>
							<div className='flex items-center gap-3'>
								<Spinner />
								<Text size='sm'>Syncing with your POS</Text>
							</div>
							<Skeleton className='h-6 w-2/3' />
							<Skeleton />
							<Skeleton className='w-5/6' />
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<EmptyState.Root>
							<EmptyState.Icon>
								<Icon size='lg'>
									<FileSearch />
								</Icon>
							</EmptyState.Icon>
							<EmptyState.Title>No archived reports</EmptyState.Title>
							<EmptyState.Description>
								Reports you archive will show up here so you can restore them.
							</EmptyState.Description>
							<EmptyState.Actions>
								<Button>Browse reports</Button>
							</EmptyState.Actions>
						</EmptyState.Root>
					</Card.Root>
				</div>
			</Sidebar.Content>
		</Sidebar.Layout>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default WebPage
