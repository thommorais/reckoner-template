'use client'

import type { ComponentPropsWithRef } from 'react'
import { Toaster, toast } from 'sonner'
import { cn } from './lib/cn'
import { dim, neutral, raised } from './lib/theme'
import { interactive } from './lib/interactive'
import { displayLabel, mutedText } from './lib/text-styles'

const Provider = (props: React.ComponentProps<typeof Toaster>) => (
	<Toaster
		position='top-center'
		{...props}
		toastOptions={{
			unstyled: true,
			classNames: {
				toast: `${raised} flex w-full max-w-sm items-center gap-3 rounded-journ p-4 shadow-lg`,
				title: displayLabel,
				description: mutedText,
				actionButton: `${neutral} ml-auto shrink-0 rounded-full px-3 py-1.5 text-xs whitespace-nowrap`,
				cancelButton: `${dim} shrink-0 rounded-full px-3 py-1.5 text-xs whitespace-nowrap`,
			},
		}}
	/>
)

const show = toast

const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='toast'
		{...props}
		className={cn(raised, 'flex w-full max-w-sm items-center gap-3 rounded-journ p-4 shadow-lg', className)}
	/>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='toast-title' {...props} className={cn(displayLabel, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='toast-description' {...props} className={cn(mutedText, className)} />
)

const Action = ({ className, ...props }: ComponentPropsWithRef<'button'>) => (
	<button
		type='button'
		data-slot='toast-action'
		{...props}
		className={cn(neutral, 'ml-auto shrink-0 rounded-full px-3 py-1.5 text-xs whitespace-nowrap', className)}
	/>
)

export { Provider, show, Root, Title, Description, Action }
