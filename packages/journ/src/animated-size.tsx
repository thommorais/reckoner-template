'use client'

import { animate } from 'animejs'
import { useLayoutEffect, useRef, type ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { prefersReducedMotion } from './lib/use-enter'

type AnimatedSizeProps = ComponentPropsWithRef<'div'> & {
	/** Animate the width as the content's width changes. */
	width?: boolean
	/** Animate the height as the content's height changes. */
	height?: boolean
}

/**
 * Follows the size of its content: when the children grow or shrink, the box
 * glides to the new size. The first measure and reduced motion jump straight there.
 */
const AnimatedSize = ({ width = false, height = true, className, children, ...props }: AnimatedSizeProps) => {
	const outer = useRef<HTMLDivElement>(null)
	const inner = useRef<HTMLDivElement>(null)
	const measured = useRef(false)

	useLayoutEffect(() => {
		const box = outer.current
		const content = inner.current
		if (!box || !content) return

		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return
			const sizes: Record<string, [number, number]> = {}
			if (width) sizes.width = [box.offsetWidth, entry.contentRect.width]
			if (height) sizes.height = [box.offsetHeight, entry.contentRect.height]

			if (!measured.current || prefersReducedMotion()) {
				measured.current = true
				for (const [key, [, to]] of Object.entries(sizes)) box.style[key as 'width' | 'height'] = `${to}px`
				return
			}

			animate(box, { ...sizes, duration: 250, ease: 'outExpo' })
		})

		observer.observe(content)
		return () => observer.disconnect()
	}, [width, height])

	return (
		<div ref={outer} data-slot='animated-size' {...props} className={cn('overflow-hidden', className)}>
			<div ref={inner} className={cn(width && 'w-fit')}>
				{children}
			</div>
		</div>
	)
}

export { AnimatedSize }
export type { AnimatedSizeProps }
