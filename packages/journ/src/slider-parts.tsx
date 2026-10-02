'use client'

import * as RadixSlider from '@radix-ui/react-slider'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { TouchTarget } from './touch-target'

const Root = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSlider.Root>) => (
	<RadixSlider.Root
		data-slot='slider'
		{...props}
		className={cn('relative flex h-6 w-full touch-none items-center select-none data-[disabled]:opacity-50', className)}
	/>
)

const Track = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSlider.Track>) => (
	<RadixSlider.Track
		data-slot='slider-track'
		{...props}
		className={cn('relative h-2 grow rounded-full bg-current/15', className)}
	/>
)

const Range = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSlider.Range>) => (
	<RadixSlider.Range
		data-slot='slider-range'
		{...props}
		className={cn('absolute h-full rounded-full bg-journ-coral', className)}
	/>
)

/** Render one thumb per value. */
const Thumb = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSlider.Thumb>) => (
	<RadixSlider.Thumb
		data-slot='slider-thumb'
		{...props}
		className={cn(
			'relative block size-6 rounded-full bg-journ-paper shadow-sm outline-none transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky active:scale-[0.96]',
			className,
		)}
	>
		<TouchTarget />
	</RadixSlider.Thumb>
)

export { Root, Track, Range, Thumb }
