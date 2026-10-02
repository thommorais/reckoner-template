import { ChevronRight } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'nav'>) => (
	<nav data-slot='breadcrumbs' aria-label='Breadcrumb' {...props} className={className} />
)

const List = ({ className, ...props }: ComponentPropsWithRef<'ol'>) => (
	<ol
		data-slot='breadcrumbs-list'
		{...props}
		className={cn('flex flex-wrap items-center gap-1.5 text-sm/6', className)}
	/>
)

const Item = ({ className, ...props }: ComponentPropsWithRef<'li'>) => (
	<li data-slot='breadcrumbs-item' {...props} className={cn('inline-flex items-center gap-1.5', className)} />
)

const Link = ({ className, ...props }: ComponentPropsWithRef<'a'>) => (
	<a
		data-slot='breadcrumbs-link'
		{...props}
		className={cn(
			'rounded-sm opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
			className,
		)}
	/>
)

const Page = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='breadcrumbs-page' aria-current='page' {...props} className={cn('font-medium', className)} />
)

const Separator = ({ className, ...props }: ComponentPropsWithRef<'li'>) => (
	<li
		data-slot='breadcrumbs-separator'
		role='presentation'
		aria-hidden
		{...props}
		className={cn('opacity-40 [&>svg]:size-4', className)}
	>
		<ChevronRight />
	</li>
)

const Breadcrumbs = { Root, List, Item, Link, Page, Separator }

export { Breadcrumbs }
