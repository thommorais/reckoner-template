import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'header'>) => (
	<header data-slot='page-header' {...props} className={cn('flex items-center gap-3', className)} />
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'h1'>) => (
	<h1
		data-slot='page-header-title'
		{...props}
		className={cn('flex-1 font-journ-display text-4xl/[0.95] font-semibold uppercase', className)}
	/>
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='page-header-actions' {...props} className={cn('ml-auto flex items-center gap-2', className)} />
)

const PageHeader = { Root, Title, Actions }

export { PageHeader }
