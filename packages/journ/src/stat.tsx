import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='stat' {...props} className={cn('flex flex-col gap-1', className)} />
)

const Label = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p
		data-slot='stat-label'
		{...props}
		className={cn('font-journ-display text-xl/none font-medium uppercase', className)}
	/>
)

const Value = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p
		data-slot='stat-value'
		{...props}
		className={cn('font-journ-display text-5xl/none font-semibold tabular-nums', className)}
	/>
)

const Hint = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='stat-hint' {...props} className={cn('text-xs/4 opacity-70', className)} />
)

const Stat = { Root, Label, Value, Hint }

export { Stat }
