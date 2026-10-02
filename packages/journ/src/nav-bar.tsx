import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { TouchTarget } from './touch-target'
import { selectedWhenCurrent } from './lib/text-styles'
import { foreground, raised } from './lib/theme'

const Root = ({ className, ...props }: ComponentPropsWithRef<'nav'>) => (
	<nav
		data-slot='nav-bar'
		{...props}
		className={cn(raised, 'flex items-center justify-between rounded-full p-1.5', className)}
	/>
)

const Item = ({ className, children, ...props }: ComponentPropsWithRef<'a'>) => (
	<a
		data-slot='nav-bar-item'
		{...props}
		className={cn(
			interactive,
			foreground,
			'grid size-10 place-items-center rounded-full [&>svg]:size-5',
			selectedWhenCurrent,
			className,
		)}
	>
		<TouchTarget>{children}</TouchTarget>
	</a>
)

const NavBar = { Root, Item }

export { NavBar }
