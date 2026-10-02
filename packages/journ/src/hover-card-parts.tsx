'use client'

import * as RadixHoverCard from '@radix-ui/react-hover-card'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { floatingCard } from './lib/overlay'
import { usePopEnter } from './lib/use-enter'

const Root = RadixHoverCard.Root
const Trigger = RadixHoverCard.Trigger

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixHoverCard.Content>) => {
	const panel = usePopEnter(160)

	return (
		<RadixHoverCard.Portal>
			<RadixHoverCard.Content
				ref={panel}
				data-slot='hover-card-content'
				sideOffset={8}
				{...props}
				className={cn(floatingCard, className)}
			/>
		</RadixHoverCard.Portal>
	)
}

export { Root, Trigger, Content }
