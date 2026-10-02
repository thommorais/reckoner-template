import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { TouchTarget } from './touch-target'

const control = cn(
	interactive,
	'inline-flex min-w-10 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm/6 font-medium tabular-nums',
)

const Root = ({ className, ...props }: ComponentPropsWithRef<'nav'>) => (
	<nav
		data-slot='pagination'
		aria-label='Pagination'
		{...props}
		className={cn('flex items-center justify-between gap-3', className)}
	/>
)

const List = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='pagination-list' {...props} className={cn('flex items-center gap-1', className)} />
)

const Previous = ({ className, children = 'Previous', ...props }: ComponentPropsWithRef<'a'>) => (
	<a data-slot='pagination-previous' {...props} className={cn(control, className)}>
		<TouchTarget>
			<ChevronLeft className='size-4' />
			{children}
		</TouchTarget>
	</a>
)

const Next = ({ className, children = 'Next', ...props }: ComponentPropsWithRef<'a'>) => (
	<a data-slot='pagination-next' {...props} className={cn(control, className)}>
		<TouchTarget>
			{children}
			<ChevronRight className='size-4' />
		</TouchTarget>
	</a>
)

const Page = ({ className, children, ...props }: ComponentPropsWithRef<'a'>) => (
	<a
		data-slot='pagination-page'
		{...props}
		className={cn(control, 'aria-[current=page]:bg-journ-sky aria-[current=page]:text-journ-ink', className)}
	>
		<TouchTarget>{children}</TouchTarget>
	</a>
)

const Gap = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='pagination-gap' aria-hidden {...props} className={cn('px-2 opacity-60', className)}>
		&hellip;
	</span>
)

const Pagination = { Root, Previous, List, Page, Gap, Next }

export { Pagination }
