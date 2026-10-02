'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react'
import type { IconButtonProps } from './icon-button'
import { cn } from './lib/cn'
import { createRequiredContext } from './lib/required-context'
import { StepButton } from './step-button'

type Orientation = 'horizontal' | 'vertical'
type Options = Parameters<typeof useEmblaCarousel>[0]
type Plugins = Parameters<typeof useEmblaCarousel>[1]

type CarouselContextValue = {
	viewport: UseEmblaCarouselType[0]
	orientation: Orientation
	canPrevious: boolean
	canNext: boolean
	previous: () => void
	next: () => void
}

const [CarouselContext, useCarousel] = createRequiredContext<CarouselContextValue>('Carousel.Root')

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
	/** Embla options such as `loop` and `align`. */
	opts?: Options
	plugins?: Plugins
	orientation?: Orientation
	children?: ReactNode
}

/** Slides with Embla. Arrow keys move between slides. */
const Root = ({
	opts,
	plugins,
	orientation = 'horizontal',
	className,
	children,
	onKeyDownCapture,
	...props
}: RootProps) => {
	const [viewport, api] = useEmblaCarousel({ ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' }, plugins)
	const [canPrevious, setCanPrevious] = useState(false)
	const [canNext, setCanNext] = useState(false)

	useEffect(() => {
		if (!api) return
		const update = () => {
			setCanPrevious(api.canScrollPrev())
			setCanNext(api.canScrollNext())
		}
		update()
		api.on('select', update)
		api.on('reInit', update)
		return () => {
			api.off('select', update)
			api.off('reInit', update)
		}
	}, [api])

	const previous = () => api?.scrollPrev()
	const next = () => api?.scrollNext()
	const [back, forward] = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown']

	return (
		<CarouselContext value={{ viewport, orientation, canPrevious, canNext, previous, next }}>
			<div
				data-slot='carousel'
				role='region'
				aria-roledescription='carousel'
				{...props}
				onKeyDownCapture={(event: KeyboardEvent<HTMLDivElement>) => {
					onKeyDownCapture?.(event)
					if (event.key === back) (event.preventDefault(), previous())
					if (event.key === forward) (event.preventDefault(), next())
				}}
				className={cn('relative', className)}
			>
				{children}
			</div>
		</CarouselContext>
	)
}

const Content = ({ className, ...props }: ComponentPropsWithRef<'div'>) => {
	const { viewport, orientation } = useCarousel()

	return (
		<div ref={viewport} data-slot='carousel-viewport' className='overflow-hidden'>
			<div
				data-slot='carousel-content'
				{...props}
				className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
			/>
		</div>
	)
}

const Item = ({ className, ...props }: ComponentPropsWithRef<'div'>) => {
	const { orientation } = useCarousel()

	return (
		<div
			data-slot='carousel-item'
			role='group'
			aria-roledescription='slide'
			{...props}
			className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
		/>
	)
}

const Previous = (props: IconButtonProps) => {
	const { canPrevious, previous, orientation } = useCarousel()

	return (
		<StepButton
			data-slot='carousel-previous'
			icon={ChevronLeft}
			aria-label='Previous slide'
			disabled={!canPrevious}
			{...props}
			className={cn(orientation === 'vertical' && 'rotate-90', props.className)}
			onStep={previous}
		/>
	)
}

const Next = (props: IconButtonProps) => {
	const { canNext, next, orientation } = useCarousel()

	return (
		<StepButton
			data-slot='carousel-next'
			icon={ChevronRight}
			aria-label='Next slide'
			disabled={!canNext}
			{...props}
			className={cn(orientation === 'vertical' && 'rotate-90', props.className)}
			onStep={next}
		/>
	)
}

export { Root, Content, Item, Previous, Next, useCarousel }
export type { RootProps }
