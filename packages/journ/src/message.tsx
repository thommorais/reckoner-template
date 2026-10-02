import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

type RootProps = ComponentPropsWithRef<'div'> & { from?: 'agent' | 'user' }

const Root = ({ from = 'agent', className, ...props }: RootProps) => (
	<div
		data-slot='message'
		data-from={from}
		{...props}
		className={cn('group flex items-start gap-3 data-[from=user]:justify-end', className)}
	/>
)

const Bubble = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='message-bubble'
		{...props}
		className={cn(
			'rounded-3xl bg-journ-paper/10 p-4 text-sm/6 group-data-[from=user]:rounded-full group-data-[from=user]:bg-journ-sky group-data-[from=user]:px-4 group-data-[from=user]:py-2 group-data-[from=user]:text-journ-ink',
			className,
		)}
	/>
)

const Highlight = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span
		data-slot='message-highlight'
		{...props}
		className={cn('rounded-md bg-journ-paper/10 px-1 font-mono text-xs text-journ-yellow', className)}
	/>
)

const Message = { Root, Bubble, Highlight }

export { Message }
