'use client'

import type { ComponentPropsWithRef } from 'react'
import { Toaster, toast } from 'sonner'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { mutedText } from './lib/text-styles'

const Provider = (props: React.ComponentProps<typeof Toaster>) => (
	<Toaster
		position='top-center'
		{...props}
		toastOptions={{
			unstyled: true,
			classNames: {
				toast:
					'flex w-full max-w-sm items-center gap-3 rounded-journ bg-journ-surface p-4 text-journ-paper shadow-lg ring-1 ring-journ-paper/10',
				title: 'font-journ-display text-xl/none font-medium uppercase',
				description: mutedText,
				actionButton:
					'ml-auto shrink-0 rounded-full bg-journ-paper px-3 py-1.5 text-xs whitespace-nowrap text-journ-ink',
				cancelButton: 'shrink-0 rounded-full bg-journ-paper/10 px-3 py-1.5 text-xs whitespace-nowrap',
			},
		}}
	/>
)

const show = toast

const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='toast'
		{...props}
		className={cn(
			'flex w-full max-w-sm items-center gap-3 rounded-journ bg-journ-surface p-4 text-journ-paper shadow-lg ring-1 ring-journ-paper/10',
			className,
		)}
	/>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p
		data-slot='toast-title'
		{...props}
		className={cn('font-journ-display text-xl/none font-medium uppercase', className)}
	/>
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='toast-description' {...props} className={cn(mutedText, className)} />
)

const Action = ({ className, ...props }: ComponentPropsWithRef<'button'>) => (
	<button
		type='button'
		data-slot='toast-action'
		{...props}
		className={cn(
			'ml-auto shrink-0 rounded-full bg-journ-paper px-3 py-1.5 text-xs whitespace-nowrap text-journ-ink',
			className,
		)}
	/>
)

export { Provider, show, Root, Title, Description, Action }
