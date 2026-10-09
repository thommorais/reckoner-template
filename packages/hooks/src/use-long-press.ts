import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent, type SyntheticEvent } from 'react'

const HOLD_MS = 500

const SLOP_PX = 10

type LongPressHandlers = {
	readonly onPointerDown: (event: ReactPointerEvent) => void
	readonly onPointerMove: (event: ReactPointerEvent) => void
	readonly onPointerUp: () => void
	readonly onPointerCancel: () => void
	readonly onContextMenu: (event: SyntheticEvent) => void
}

const useLongPress = (onLongPress: () => void, disabled = false): LongPressHandlers => {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const origin = useRef<{ x: number; y: number } | null>(null)

	const cancel = useCallback(() => {
		if (timer.current !== null) {
			clearTimeout(timer.current)
			timer.current = null
		}
		origin.current = null
	}, [])

	useEffect(() => cancel, [cancel])

	const onPointerDown = useCallback(
		(event: ReactPointerEvent) => {
			if (disabled) {
				return
			}
			cancel()
			origin.current = { x: event.clientX, y: event.clientY }
			timer.current = setTimeout(() => {
				timer.current = null
				onLongPress()
			}, HOLD_MS)
		},
		[disabled, onLongPress, cancel],
	)

	const onPointerMove = useCallback(
		(event: ReactPointerEvent) => {
			if (!origin.current) {
				return
			}
			const drifted =
				Math.abs(event.clientX - origin.current.x) > SLOP_PX || Math.abs(event.clientY - origin.current.y) > SLOP_PX
			if (drifted) {
				cancel()
			}
		},
		[cancel],
	)

	const onContextMenu = useCallback((event: SyntheticEvent) => event.preventDefault(), [])

	return { onPointerDown, onPointerMove, onPointerUp: cancel, onPointerCancel: cancel, onContextMenu }
}

export { useLongPress }
