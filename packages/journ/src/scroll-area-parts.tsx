'use client'

import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { TouchTarget } from './touch-target'

const Root = ({ className, type = 'hover', ...props }: ComponentPropsWithRef<typeof RadixScrollArea.Root>) => (
	<RadixScrollArea.Root
		data-slot='scroll-area'
		type={type}
		{...props}
		className={cn('relative overflow-hidden', className)}
	/>
)

const Viewport = ({ className, ...props }: ComponentPropsWithRef<typeof RadixScrollArea.Viewport>) => (
	<RadixScrollArea.Viewport
		data-slot='scroll-area-viewport'
		{...props}
		className={cn(
			'size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:outline-journ-sky',
			className,
		)}
	/>
)

/** Draws its own thumb, so it needs no child. */
const Scrollbar = ({
	className,
	orientation = 'vertical',
	...props
}: ComponentPropsWithRef<typeof RadixScrollArea.Scrollbar>) => (
	<RadixScrollArea.Scrollbar
		data-slot='scroll-area-scrollbar'
		orientation={orientation}
		{...props}
		className={cn(
			'flex touch-none p-0.5 transition-opacity select-none data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
			'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5',
			className,
		)}
	>
		<RadixScrollArea.Thumb
			data-slot='scroll-area-thumb'
			className='relative flex-1 rounded-full bg-current/30 transition-colors hover:bg-current/50'
		>
			<TouchTarget />
		</RadixScrollArea.Thumb>
	</RadixScrollArea.Scrollbar>
)

const Corner = RadixScrollArea.Corner

export { Root, Viewport, Scrollbar, Corner }
