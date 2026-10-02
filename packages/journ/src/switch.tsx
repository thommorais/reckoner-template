'use client'

import * as RadixSwitch from '@radix-ui/react-switch'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { TouchTarget } from './touch-target'

const Switch = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSwitch.Root>) => (
	<RadixSwitch.Root
		data-slot='switch'
		{...props}
		className={cn(
			pressReset,
			'relative inline-flex h-7 w-12 shrink-0 cursor-default items-center rounded-full bg-current/20 p-1 outline-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
			'data-[state=checked]:bg-journ-coral disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
	>
		<TouchTarget />
		<RadixSwitch.Thumb
			data-slot='switch-thumb'
			className='bg-journ-paper pointer-events-none block size-5 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-5'
		/>
	</RadixSwitch.Root>
)

export { Switch }
