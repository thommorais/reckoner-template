import { NavBar } from 'journ/nav-bar'
import { Home, LineChart, Settings, Wallet } from 'lucide-react'

const items = [
	{ href: '/journ', label: 'Home', icon: Home },
	{ href: '/journ/revenue', label: 'Revenue', icon: LineChart },
	{ href: '/journ/reports', label: 'Reports', icon: Wallet },
	{ href: '/journ/categories', label: 'Categories', icon: Settings },
] as const

const BottomNav = ({ current }: { current: string }) => (
	<NavBar.Root className='sticky bottom-4 mt-auto'>
		{items.map(({ href, label, icon: Icon }) => (
			<NavBar.Item key={href} href={href} aria-label={label} aria-current={href === current ? 'page' : undefined}>
				<Icon />
			</NavBar.Item>
		))}
	</NavBar.Root>
)

export { BottomNav }
