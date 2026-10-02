import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { TouchTarget } from './touch-target'
import { selectedWhenCurrent } from './lib/text-styles'

const Layout = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='sidebar-layout' {...props} className={cn('flex min-h-dvh w-full', className)} />
)

const Content = ({ className, ...props }: ComponentPropsWithRef<'main'>) => (
	<main data-slot='sidebar-content' {...props} className={cn('min-w-0 flex-1 p-6 lg:p-10', className)} />
)

const Root = ({ className, ...props }: ComponentPropsWithRef<'aside'>) => (
	<aside
		data-slot='sidebar'
		{...props}
		className={cn(
			'sticky top-0 flex h-dvh w-64 shrink-0 flex-col gap-4 bg-journ-surface p-4 text-journ-paper',
			className,
		)}
	/>
)

const Header = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='sidebar-header' {...props} className={cn('flex items-center gap-3 px-2 pt-2', className)} />
)

const Body = ({ className, ...props }: ComponentPropsWithRef<'nav'>) => (
	<nav
		data-slot='sidebar-body'
		{...props}
		className={cn('scrollbar-journ flex flex-1 flex-col gap-6 overflow-y-auto', className)}
	/>
)

const Section = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='sidebar-section' {...props} className={cn('flex flex-col gap-1', className)} />
)

const Heading = ({ className, ...props }: ComponentPropsWithRef<'h3'>) => (
	<h3
		data-slot='sidebar-heading'
		{...props}
		className={cn('px-3 pb-1 font-mono text-xs uppercase opacity-60', className)}
	/>
)

const Item = ({ className, children, ...props }: ComponentPropsWithRef<'a'>) => (
	<a
		data-slot='sidebar-item'
		{...props}
		className={cn(
			interactive,
			'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm/6 font-medium [&>svg]:size-4 [&>svg]:shrink-0',
			selectedWhenCurrent,
			className,
		)}
	>
		<TouchTarget>{children}</TouchTarget>
	</a>
)

const Footer = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='sidebar-footer'
		{...props}
		className={cn('flex items-center gap-3 border-t border-current/10 px-2 pt-4', className)}
	/>
)

const Sidebar = { Layout, Root, Header, Body, Section, Heading, Item, Footer, Content }

export { Sidebar }
