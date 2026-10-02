'use client'

import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { Actions } from './lib/modal-parts'
import { ModalContent } from './lib/modal-content'
import { centeredPanel } from './lib/overlay'
import { displayTitle, mutedText } from './lib/text-styles'
import type { VariantProps } from './lib/tv'
import { modalPanelEnter } from './lib/use-enter'

const Root = RadixAlertDialog.Root
const Trigger = RadixAlertDialog.Trigger
const Cancel = RadixAlertDialog.Cancel
const Action = RadixAlertDialog.Action

type ContentProps = ComponentPropsWithRef<typeof RadixAlertDialog.Content> & VariantProps<typeof centeredPanel>

const Content = ({ tone, className, ...props }: ContentProps) => (
	<ModalContent
		primitive={RadixAlertDialog}
		slot='alert-dialog'
		enter={modalPanelEnter}
		{...props}
		className={centeredPanel({ tone, class: className })}
	/>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<typeof RadixAlertDialog.Title>) => (
	<RadixAlertDialog.Title data-slot='alert-dialog-title' {...props} className={cn(displayTitle, className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<typeof RadixAlertDialog.Description>) => (
	<RadixAlertDialog.Description data-slot='alert-dialog-description' {...props} className={cn(mutedText, className)} />
)

export { Root, Trigger, Content, Title, Description, Actions, Cancel, Action }
