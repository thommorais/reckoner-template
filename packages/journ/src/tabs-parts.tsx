'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { controlSize, selectedWhenActive } from './lib/text-styles'

const Root = ({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.Root>) => (
	<RadixTabs.Root data-slot='tabs' {...props} className={cn('flex flex-col gap-4', className)} />
)

const List = ({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.List>) => (
	<RadixTabs.List
		data-slot='tabs-list'
		{...props}
		className={cn('flex items-center gap-1 rounded-full bg-current/10 p-1.5', className)}
	/>
)

const Trigger = ({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.Trigger>) => (
	<RadixTabs.Trigger
		data-slot='tabs-trigger'
		{...props}
		className={cn(
			pressReset,
			controlSize,
			'flex-1 cursor-default rounded-full px-4 font-medium outline-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
			selectedWhenActive,
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
	/>
)

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.Content>) => (
	<RadixTabs.Content
		data-slot='tabs-content'
		{...props}
		className={cn('outline-none focus-visible:outline-2 focus-visible:outline-journ-sky', className)}
	/>
)

export { Root, List, Trigger, Content }
