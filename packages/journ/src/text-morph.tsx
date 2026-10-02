'use client'

import { animate } from 'animejs'
import { useLayoutEffect, useRef, type ComponentPropsWithRef, type ElementType } from 'react'
import { cn } from './lib/cn'
import { prefersReducedMotion } from './lib/use-enter'

type TextMorphProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
	children: string
	as?: ElementType
}

/**
 * Plays text one character at a time. When the text changes, only the characters
 * that differ drop in again. Screen readers get the whole string once.
 */
const TextMorph = ({ children: text, as: Component = 'span', className, ...props }: TextMorphProps) => {
	const root = useRef<HTMLElement>(null)
	const previous = useRef(text)

	useLayoutEffect(() => {
		const before = [...previous.current]
		previous.current = text
		if (!root.current || prefersReducedMotion()) return

		const chars = [...text]
		const letters = root.current.querySelectorAll<HTMLElement>('[data-char]')
		let order = 0
		chars.forEach((char, index) => {
			const element = letters[index]
			if (!element || char === before[index]) return
			animate(element, { opacity: [0, 1], translateY: [6, 0], duration: 220, delay: order++ * 18, ease: 'outQuad' })
		})
	}, [text])

	return (
		<Component ref={root} data-slot='text-morph' {...props} className={cn('whitespace-pre', className)}>
			<span className='sr-only'>{text}</span>
			<span aria-hidden>
				{[...text].map((char, index) => (
					<span key={index} data-char className='inline-block whitespace-pre'>
						{char}
					</span>
				))}
			</span>
		</Component>
	)
}

export { TextMorph }
export type { TextMorphProps }
