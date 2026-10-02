'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { Actions, Body } from './lib/modal-parts'
import { centeredPanel, modalOverlay } from './lib/overlay'
import { displayTitle, mutedText } from './lib/text-styles'
import type { VariantProps } from './lib/tv'
import { useModalEnter } from './lib/use-enter'

const Root = RadixDialog.Root
const Trigger = RadixDialog.Trigger
const Close = RadixDialog.Close

type ContentProps = ComponentPropsWithRef<typeof RadixDialog.Content> & VariantProps<typeof centeredPanel>

const Content = ({ tone, className, ...props }: ContentProps) => {
	const { overlay, panel } = useModalEnter()

	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay ref={overlay} data-slot='dialog-overlay' className={modalOverlay} />
			<RadixDialog.Content
				ref={panel}
				data-slot='dialog'
				{...props}
				className={centeredPanel({ tone, class: cn('max-h-[85dvh]', className) })}
			/>
		</RadixDialog.Portal>
	)
}

const Title = ({ className, ...props }: ComponentPropsWithRef<typeof RadixDialog.Title>) => (
	<RadixDialog.Title data-slot='dialog-title' {...props} className={cn(displayTitle, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof RadixDialog.Description>) => (
	<RadixDialog.Description data-slot='dialog-description' {...props} className={cn(mutedText, className)} />
)

export { Root, Trigger, Close, Content, Title, Description, Body, Actions }
export type { ContentProps as DialogContentProps }
