import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { displayTitle, mutedText } from './lib/text-styles'

const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='empty-state'
		{...props}
		className={cn('flex flex-col items-center gap-3 px-6 py-10 text-center', className)}
	/>
)

const Icon = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span
		data-slot='empty-state-icon'
		aria-hidden
		{...props}
		className={cn(
			'grid size-14 place-items-center rounded-3xl bg-journ-yellow text-journ-ink [&>svg]:size-6',
			className,
		)}
	/>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'h3'>) => (
	<h3 data-slot='empty-state-title' {...props} className={cn(displayTitle, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='empty-state-description' {...props} className={cn('max-w-xs', mutedText, className)} />
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='empty-state-actions' {...props} className={cn('mt-2 flex items-center gap-2', className)} />
)

const EmptyState = { Root, Icon, Title, Description, Actions }

export { EmptyState }
