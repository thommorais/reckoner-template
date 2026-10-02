'use client'

import * as RadixRadio from '@radix-ui/react-radio-group'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { TouchTarget } from './touch-target'

const Group = ({ className, ...props }: ComponentPropsWithRef<typeof RadixRadio.Root>) => (
	<RadixRadio.Root data-slot='radio-group' {...props} className={cn('flex flex-col gap-3', className)} />
)

const Item = ({ className, ...props }: ComponentPropsWithRef<typeof RadixRadio.Item>) => (
	<RadixRadio.Item
		data-slot='radio'
		{...props}
		className={cn(
			'relative grid size-6 shrink-0 cursor-default place-items-center rounded-full border-2 border-current/30 outline-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
			'data-[state=checked]:border-journ-coral disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
	>
		<TouchTarget />
		<RadixRadio.Indicator data-slot='radio-indicator' className='bg-journ-coral block size-3 rounded-full' />
	</RadixRadio.Item>
)

export { Group, Item }
