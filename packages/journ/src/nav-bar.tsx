import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'nav'>) => (
	<nav
		data-slot='nav-bar'
		{...props}
		className={cn('flex items-center justify-between rounded-full bg-journ-ink p-1.5', className)}
	/>
)

const Item = ({ className, ...props }: ComponentPropsWithRef<'a'>) => (
	<a
		data-slot='nav-bar-item'
		{...props}
		className={cn(
			'grid size-10 place-items-center rounded-full text-journ-paper aria-[current=page]:bg-journ-sky aria-[current=page]:text-journ-ink [&>svg]:size-5',
			className,
		)}
	/>
)

const NavBar = { Root, Item }

export { NavBar }
