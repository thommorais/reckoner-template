import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { raised } from './lib/theme'

/** Render it while something is selected; it floats at the bottom of the page. */
const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='bulk-bar'
		role='toolbar'
		{...props}
		className={cn(raised, 'sticky bottom-4 flex items-center gap-3 rounded-full p-2 pl-5 shadow-lg', className)}
	/>
)

const Count = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p
		data-slot='bulk-bar-count'
		aria-live='polite'
		{...props}
		className={cn('text-sm/6 font-medium tabular-nums', className)}
	/>
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='bulk-bar-actions' {...props} className={cn('ml-auto flex items-center gap-1', className)} />
)

const BulkBar = { Root, Count, Actions }

export { BulkBar }
