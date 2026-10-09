import { useCallback, useState, type RefCallback } from 'react'
import { useWindowEvent } from './use-window-event'

type UseMouseOptions = {
	resetOnExit?: boolean
}

type UseMouseReturnValue<T extends HTMLElement = HTMLElement> = {
	ref: RefCallback<T>
	x: number
	y: number
}

type UseMousePositionReturnValue = {
	x: number
	y: number
}

const ORIGIN = { x: 0, y: 0 }

const useMouse = <T extends HTMLElement = HTMLElement>({
	resetOnExit = false,
}: UseMouseOptions = {}): UseMouseReturnValue<T> => {
	const [position, setPosition] = useState(ORIGIN)

	const ref: RefCallback<T> = useCallback(
		node => {
			if (!node) {
				return
			}

			const trackPosition = (event: MouseEvent) => {
				const rect = node.getBoundingClientRect()
				setPosition({
					x: Math.max(0, Math.round(event.clientX - rect.left)),
					y: Math.max(0, Math.round(event.clientY - rect.top)),
				})
			}
			const resetPosition = () => setPosition(ORIGIN)

			node.addEventListener('mousemove', trackPosition)
			if (resetOnExit) {
				node.addEventListener('mouseleave', resetPosition)
			}

			return () => {
				node.removeEventListener('mousemove', trackPosition)
				node.removeEventListener('mouseleave', resetPosition)
			}
		},
		[resetOnExit],
	)

	return { ref, ...position }
}

const useMousePosition = (): UseMousePositionReturnValue => {
	const [position, setPosition] = useState(ORIGIN)

	useWindowEvent('mousemove', event => setPosition({ x: event.clientX, y: event.clientY }))

	return position
}

export { useMouse, useMousePosition }

export type { UseMouseOptions, UseMousePositionReturnValue, UseMouseReturnValue }
