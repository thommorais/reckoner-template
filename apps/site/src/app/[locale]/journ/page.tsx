import Link from 'next/link'
import { Card } from 'journ/card'
import { PageTitle } from './_components/page-title'

const pages = [
	{ href: 'journ/reports', title: 'Reports', tone: 'dark' },
	{ href: 'journ/revenue', title: 'Revenue', tone: 'coral' },
	{ href: 'journ/categories', title: 'Categories', tone: 'yellow' },
] as const

const JournHome = async ({ params }: { params: Promise<{ locale: string }> }): Promise<React.ReactNode> => {
	const { locale } = await params

	return (
		<>
			<PageTitle>Journ</PageTitle>
			{pages.map(page => (
				<Link key={page.href} href={`/${locale}/${page.href}`}>
					<Card.Root tone={page.tone}>
						<Card.Title>{page.title}</Card.Title>
					</Card.Root>
				</Link>
			))}
		</>
	)
}

// oxlint-disable-next-line import/no-default-export -- page
export default JournHome
