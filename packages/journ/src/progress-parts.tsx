'use client'

import * as RadixProgress from '@radix-ui/react-progress'
import { type ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'
import { fills } from './lib/tones'
import { createRequiredContext } from './lib/required-context'

const [PercentageContext, usePercentage] = createRequiredContext<number>('Progress.Root')

type RootProps = Omit<ComponentPropsWithRef<typeof RadixProgress.Root>, 'value'> & { value: number }

const Root = ({ value, max = 100, className, ...props }: RootProps) => {
	const percentage = Math.min(100, Math.max(0, (value / max) * 100))

	return (
		<PercentageContext value={percentage}>
			<RadixProgress.Root
				data-slot='progress'
				value={value}
				max={max}
				{...props}
				className={cn('relative h-3 w-full overflow-hidden rounded-full bg-current/15', className)}
			/>
		</PercentageContext>
	)
}

const indicator = tv({
	base: 'size-full rounded-full transition-transform duration-300 ease-out',
	variants: {
		tone: fills,
	},
	defaultVariants: { tone: 'coral' },
})

type IndicatorProps = ComponentPropsWithRef<typeof RadixProgress.Indicator> & VariantProps<typeof indicator>

const Indicator = ({ tone, className, style, ...props }: IndicatorProps) => {
	const percentage = usePercentage()

	return (
		<RadixProgress.Indicator
			data-slot='progress-indicator'
			{...props}
			style={{ ...style, transform: `translateX(-${100 - percentage}%)` }}
			className={indicator({ tone, class: className })}
		/>
	)
}

export { Root, Indicator }
export type { RootProps as ProgressProps }
