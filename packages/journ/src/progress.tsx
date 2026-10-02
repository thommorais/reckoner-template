'use client'

import * as RadixProgress from '@radix-ui/react-progress'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'

const indicator = tv({
	base: 'size-full rounded-full transition-transform duration-500 ease-out',
	variants: {
		tone: {
			paper: 'bg-journ-paper',
			coral: 'bg-journ-coral',
			yellow: 'bg-journ-yellow',
			indigo: 'bg-journ-indigo',
			mint: 'bg-journ-mint',
			sky: 'bg-journ-sky',
		},
	},
	defaultVariants: { tone: 'coral' },
})

type ProgressProps = Omit<ComponentPropsWithRef<typeof RadixProgress.Root>, 'value'> &
	VariantProps<typeof indicator> & { value: number }

const Progress = ({ value, max = 100, tone, className, ...props }: ProgressProps) => {
	const percentage = Math.min(100, Math.max(0, (value / max) * 100))

	return (
		<RadixProgress.Root
			data-slot='progress'
			value={value}
			max={max}
			{...props}
			className={cn('relative h-3 w-full overflow-hidden rounded-full bg-current/15', className)}
		>
			<RadixProgress.Indicator
				data-slot='progress-indicator'
				className={indicator({ tone })}
				style={{ transform: `translateX(-${100 - percentage}%)` }}
			/>
		</RadixProgress.Root>
	)
}

export { Progress }
export type { ProgressProps }
