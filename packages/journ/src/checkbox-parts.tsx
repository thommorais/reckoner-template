'use client'

import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { TouchTarget } from './touch-target'

const Root = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixCheckbox.Root>) => (
	<RadixCheckbox.Root
		data-slot='checkbox'
		{...props}
		className={cn(
			pressReset,
			'group relative grid size-6 shrink-0 cursor-default place-items-center rounded-lg border-2 border-current/30 outline-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
			'data-[state=checked]:border-journ-coral data-[state=checked]:bg-journ-coral data-[state=checked]:text-journ-ink',
			'data-[state=indeterminate]:border-journ-coral data-[state=indeterminate]:bg-journ-coral data-[state=indeterminate]:text-journ-ink',
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
	>
		<TouchTarget />
		{children}
	</RadixCheckbox.Root>
)

/** Shows a check, or a minus when the root is indeterminate. Pass children to use your own icon. */
const Indicator = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixCheckbox.Indicator>) => (
	<RadixCheckbox.Indicator
		data-slot='checkbox-indicator'
		{...props}
		className={cn('grid place-items-center [&>svg]:size-4', className)}
	>
		{children ?? (
			<>
				<Check className='group-data-[state=indeterminate]:hidden' />
				<Minus className='hidden group-data-[state=indeterminate]:block' />
			</>
		)}
	</RadixCheckbox.Indicator>
)

export { Root, Indicator }
