'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { floatingCard } from './lib/overlay'
import { usePopEnter } from './lib/use-enter'

const Root = RadixPopover.Root
const Trigger = RadixPopover.Trigger
const Close = RadixPopover.Close

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixPopover.Content>) => {
	const panel = usePopEnter()

	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				ref={panel}
				data-slot='popover-content'
				sideOffset={8}
				{...props}
				className={cn(floatingCard, className)}
			/>
		</RadixPopover.Portal>
	)
}

export { Root, Trigger, Close, Content }
