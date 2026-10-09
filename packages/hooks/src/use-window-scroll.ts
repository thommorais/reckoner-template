import { isServerSide } from '@thom/utils/env'
import { useMemo, useSyncExternalStore } from 'react'

type UseWindowScrollPosition = {
	x: number
	y: number
}

type UseWindowScrollTo = (position: Partial<UseWindowScrollPosition>) => void
type UseWindowScrollReturnValue = [UseWindowScrollPosition, UseWindowScrollTo]

const PASSIVE = { passive: true } as const

const subscribe = (callback: () => void) => {
	window.addEventListener('scroll', callback, PASSIVE)
	window.addEventListener('resize', callback, PASSIVE)

	return () => {
		window.removeEventListener('scroll', callback)
		window.removeEventListener('resize', callback)
	}
}

const getSnapshot = () => `${window.scrollX},${window.scrollY}`

const getServerSnapshot = () => '0,0'

const scrollTo: UseWindowScrollTo = ({ x, y }) => {
	if (isServerSide()) {
		return
	}

	const scrollOptions: ScrollToOptions = { behavior: 'smooth' }

	if (typeof x === 'number') {
		scrollOptions.left = x
	}

	if (typeof y === 'number') {
		scrollOptions.top = y
	}

	window.scrollTo(scrollOptions)
}

const useWindowScroll = (): UseWindowScrollReturnValue => {
	const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	const position = useMemo((): UseWindowScrollPosition => {
		const [x = 0, y = 0] = snapshot.split(',').map(Number)
		return { x, y }
	}, [snapshot])

	return [position, scrollTo]
}

export { useWindowScroll }

export type { UseWindowScrollPosition, UseWindowScrollReturnValue, UseWindowScrollTo }
