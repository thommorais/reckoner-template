import { animate } from 'animejs'
import { useLayoutEffect, useRef } from 'react'

const prefersReducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Plays an animejs enter animation once, when the element mounts. */
const useEnter = <T extends HTMLElement>(keyframes: Parameters<typeof animate>[1]) => {
	const element = useRef<T>(null)

	useLayoutEffect(() => {
		if (!element.current || prefersReducedMotion()) return
		animate(element.current, keyframes)
	}, [])

	return element
}

export { prefersReducedMotion, useEnter }
