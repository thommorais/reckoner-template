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

/** Quiet fade and scale for frequent floating surfaces (menus, popovers). */
const usePopEnter = (duration = 200) =>
	useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.96, 1], duration, ease: 'outQuad' })

/** Overlay fade plus a panel that scales in from 0.85, for dialogs and alert dialogs. */
const useModalEnter = () => ({
	overlay: useEnter<HTMLDivElement>({ opacity: [0, 1], duration: 200, ease: 'outQuad' }),
	panel: useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.85, 1], duration: 200, ease: 'outExpo' }),
})

/** Animates an element from zero height to its natural height when it mounts. */
const useExpand = <T extends HTMLElement>() => {
	const element = useRef<T>(null)

	useLayoutEffect(() => {
		const node = element.current
		if (!node || prefersReducedMotion()) return
		animate(node, {
			height: [0, node.scrollHeight],
			opacity: [0, 1],
			duration: 200,
			ease: 'outQuad',
			onComplete: () => {
				node.style.height = ''
			},
		})
	}, [])

	return element
}

export { prefersReducedMotion, useEnter, useExpand, useModalEnter, usePopEnter }
