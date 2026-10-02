'use client'

import type { ComponentPropsWithRef } from 'react'
import { Drawer as Vaul } from 'vaul'
import { cn } from './lib/cn'
import { Actions, Body } from './lib/modal-parts'
import { modalOverlay } from './lib/overlay'
import { displayTitle, mutedText } from './lib/text-styles'

const Root = Vaul.Root
const Trigger = Vaul.Trigger
const Close = Vaul.Close

const Content = ({ className, children, ...props }: ComponentPropsWithRef<typeof Vaul.Content>) => (
	<Vaul.Portal>
		<Vaul.Overlay data-slot='drawer-overlay' className={modalOverlay} />
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
	<Vaul.Title data-slot='drawer-title' {...props} className={cn(displayTitle, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof Vaul.Description>) => (
	<Vaul.Description data-slot='drawer-description' {...props} className={cn(mutedText, className)} />
)

export { Root, Trigger, Close, Content, Title, Description, Body, Actions }
