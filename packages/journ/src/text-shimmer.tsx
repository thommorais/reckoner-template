import type { ComponentPropsWithRef, ElementType } from 'react'
import { cn } from './lib/cn'
import { shimmer } from './lib/theme'

type TextShimmerProps = ComponentPropsWithRef<'span'> & {
	/** The element to render, `span` by default. */
	as?: ElementType
}

/** Text with a light sweeping across it, for loading states. Still in reduced motion. */
const TextShimmer = ({ as: Component = 'span', className, ...props }: TextShimmerProps) => (
	<Component
		data-slot='text-shimmer'
		{...props}
		className={cn(
			shimmer,
			'animate-journ-shimmer bg-size-[200%_100%] bg-clip-text text-transparent motion-reduce:animate-none',
			className,
		)}
	/>
)

export { TextShimmer }
export type { TextShimmerProps }
