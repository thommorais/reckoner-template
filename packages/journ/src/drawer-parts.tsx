'use client'

import type { ComponentPropsWithRef } from 'react'
import { Drawer as Vaul } from 'vaul'
import { cn } from './lib/cn'

const Root = Vaul.Root
const Trigger = Vaul.Trigger
const Close = Vaul.Close

const Content = ({ className, children, ...props }: ComponentPropsWithRef<typeof Vaul.Content>) => (
	<Vaul.Portal>
		<Vaul.Overlay data-slot='drawer-overlay' className='bg-journ-ink/60 fixed inset-0' />
		<Vaul.Content
			data-slot='drawer'
			{...props}
			className={cn(
				'fixed inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] w-full max-w-sm flex-col gap-4 rounded-t-journ bg-journ-surface p-5 text-journ-paper outline-none',
				className,
			)}
		>
			<div data-slot='drawer-handle' className='bg-journ-paper/30 mx-auto h-1.5 w-12 shrink-0 rounded-full' />
			{children}
		</Vaul.Content>
	</Vaul.Portal>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<typeof Vaul.Title>) => (
	<Vaul.Title
		data-slot='drawer-title'
		{...props}
		className={cn('font-journ-display text-3xl/[0.95] font-semibold uppercase', className)}
	/>
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof Vaul.Description>) => (
	<Vaul.Description data-slot='drawer-description' {...props} className={cn('text-sm/5 opacity-70', className)} />
)

const Body = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='drawer-body' {...props} className={cn('flex flex-col gap-2 overflow-y-auto', className)} />
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='drawer-actions' {...props} className={cn('flex items-center justify-end gap-2', className)} />
)

export { Root, Trigger, Close, Content, Title, Description, Body, Actions }
