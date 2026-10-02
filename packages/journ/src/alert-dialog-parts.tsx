'use client'

import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { Actions } from './lib/modal-parts'
import { centeredPanel, modalOverlay } from './lib/overlay'
import { displayTitle, mutedText } from './lib/text-styles'
import type { VariantProps } from './lib/tv'
import { useModalEnter } from './lib/use-enter'

const Root = RadixAlertDialog.Root
const Trigger = RadixAlertDialog.Trigger
const Cancel = RadixAlertDialog.Cancel
const Action = RadixAlertDialog.Action

type ContentProps = ComponentPropsWithRef<typeof RadixAlertDialog.Content> & VariantProps<typeof centeredPanel>

const Content = ({ tone, className, ...props }: ContentProps) => {
	const { overlay, panel } = useModalEnter()

	return (
		<RadixAlertDialog.Portal>
			<RadixAlertDialog.Overlay ref={overlay} data-slot='alert-dialog-overlay' className={modalOverlay} />
			<RadixAlertDialog.Content
				ref={panel}
				data-slot='alert-dialog'
				{...props}
				className={centeredPanel({ tone, class: className })}
			/>
		</RadixAlertDialog.Portal>
	)
}

const Title = ({ className, ...props }: ComponentPropsWithRef<typeof RadixAlertDialog.Title>) => (
	<RadixAlertDialog.Title data-slot='alert-dialog-title' {...props} className={cn(displayTitle, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof RadixAlertDialog.Description>) => (
	<RadixAlertDialog.Description data-slot='alert-dialog-description' {...props} className={cn(mutedText, className)} />
)

export { Root, Trigger, Content, Title, Description, Actions, Cancel, Action }
