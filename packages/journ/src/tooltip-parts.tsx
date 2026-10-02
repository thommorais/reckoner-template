'use client'

import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { useEnter } from './lib/use-enter'

const Provider = RadixTooltip.Provider

/** Includes its own provider so a tooltip works without extra setup. */
const Root = ({ delayDuration = 300, ...props }: ComponentPropsWithRef<typeof RadixTooltip.Root>) => (
	<RadixTooltip.Provider delayDuration={delayDuration}>
		<RadixTooltip.Root {...props} />
	</RadixTooltip.Provider>
)

const Trigger = RadixTooltip.Trigger

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixTooltip.Content>) => {
	const panel = useEnter<HTMLDivElement>({ opacity: [0, 1], translateY: [4, 0], duration: 180, ease: 'outQuad' })

	return (
		<RadixTooltip.Portal>
			<RadixTooltip.Content
				ref={panel}
				data-slot='tooltip-content'
				sideOffset={8}
				{...props}
				className={cn(
					'z-50 max-w-60 rounded-full bg-journ-ink px-3 py-1.5 text-xs/4 text-journ-paper shadow-lg',
					className,
				)}
			/>
		</RadixTooltip.Portal>
	)
}

export { Provider, Root, Trigger, Content }
