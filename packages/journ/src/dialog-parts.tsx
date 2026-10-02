'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { useEnter } from './lib/use-enter'
import { surfaceTones } from './lib/tones'
import { tv, type VariantProps } from './lib/tv'

const Root = RadixDialog.Root
const Trigger = RadixDialog.Trigger
const Close = RadixDialog.Close

const dialogContent = tv({
	base: 'rounded-journ fixed top-1/2 left-1/2 flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-5 outline-none',
	variants: { tone: surfaceTones },
	defaultVariants: { tone: 'dark' },
})

type ContentProps = ComponentPropsWithRef<typeof RadixDialog.Content> & VariantProps<typeof dialogContent>

const Content = ({ tone, className, ...props }: ContentProps) => {
	const overlay = useEnter<HTMLDivElement>({ opacity: [0, 1], duration: 200, ease: 'outQuad' })
	const panel = useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.95, 1], duration: 300, ease: 'outExpo' })

	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay ref={overlay} data-slot='dialog-overlay' className='bg-journ-ink/60 fixed inset-0' />
			<RadixDialog.Content
				ref={panel}
				data-slot='dialog'
				{...props}
				className={dialogContent({ tone, class: className })}
			/>
		</RadixDialog.Portal>
	)
}

const Title = ({ className, ...props }: ComponentPropsWithRef<typeof RadixDialog.Title>) => (
	<RadixDialog.Title
		data-slot='dialog-title'
		{...props}
		className={cn('font-journ-display text-3xl/[0.95] font-semibold uppercase', className)}
	/>
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof RadixDialog.Description>) => (
	<RadixDialog.Description
		data-slot='dialog-description'
		{...props}
		className={cn('text-sm/5 opacity-70', className)}
	/>
)

const Body = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='dialog-body' {...props} className={cn('flex flex-col gap-3 overflow-y-auto', className)} />
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='dialog-actions' {...props} className={cn('flex items-center justify-end gap-2', className)} />
)

export { Root, Trigger, Close, Content, Title, Description, Body, Actions }
export type { ContentProps as DialogContentProps }
