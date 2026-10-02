'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { floatingSurface } from './lib/overlay'
import { useEnter } from './lib/use-enter'

const Root = RadixPopover.Root
const Trigger = RadixPopover.Trigger
const Close = RadixPopover.Close

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixPopover.Content>) => {
	const panel = useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.96, 1], duration: 200, ease: 'outQuad' })

	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				ref={panel}
				data-slot='popover-content'
				sideOffset={8}
				{...props}
				className={cn(floatingSurface, 'flex w-72 flex-col gap-2 p-4', className)}
			/>
		</RadixPopover.Portal>
	)
}

export { Root, Trigger, Close, Content }
