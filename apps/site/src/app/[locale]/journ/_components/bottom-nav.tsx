import { NavBar } from 'journ/nav-bar'
import { Page } from 'journ/page'
import { Home, LineChart, Settings, Wallet } from 'lucide-react'

const items = [
	{ href: '/journ', label: 'Home', icon: Home },
	{ href: '/journ/revenue', label: 'Revenue', icon: LineChart },
	{ href: '/journ/reports', label: 'Reports', icon: Wallet },
	{ href: '/journ/categories', label: 'Categories', icon: Settings },
] as const

const BottomNav = ({ current }: { current: string }) => (
	<Page.Footer>
		<NavBar.Root>
			{items.map(({ href, label, icon: Icon }) => (
				<NavBar.Item key={href} href={href} aria-label={label} aria-current={href === current ? 'page' : undefined}>
					<Icon />
				</NavBar.Item>
			))}
		</NavBar.Root>
	</Page.Footer>
)

export { BottomNav }
