'use client'

import * as RadixToggleGroup from '@radix-ui/react-toggle-group'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { controlSize, selectedWhenOn } from './lib/text-styles'

const Root = ({ className, ...props }: ComponentPropsWithRef<typeof RadixToggleGroup.Root>) => (
	<RadixToggleGroup.Root
		data-slot='toggle-group'
		{...props}
		className={cn('inline-flex items-center gap-1 rounded-full bg-current/10 p-1.5', className)}
	/>
)

const Item = ({ className, ...props }: ComponentPropsWithRef<typeof RadixToggleGroup.Item>) => (
	<RadixToggleGroup.Item
		data-slot='toggle-group-item'
		{...props}
		className={cn(
			pressReset,
			controlSize,
			'inline-flex cursor-default items-center justify-center gap-1.5 rounded-full px-4 font-medium outline-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky [&>svg]:size-4',
			selectedWhenOn,
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
	/>
)

export { Root, Item }
