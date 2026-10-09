import { useCallback, useSyncExternalStore } from 'react'

const breakpoints = {
	sm: '(min-width: 40rem)',
	md: '(min-width: 48rem)',
	'max-md': '(width < 48rem)',
	lg: '(min-width: 64rem)',
	'max-lg': '(width < 64rem)',
} as const

type Breakpoint = keyof typeof breakpoints
type BreakpointValue = (typeof breakpoints)[Breakpoint]

const useMediaQuery = (query: BreakpointValue | string) => {
	const subscribe = useCallback(
		(callback: () => void) => {
			const matchMedia = window.matchMedia(query)
			matchMedia.addEventListener('change', callback)
			return () => matchMedia.removeEventListener('change', callback)
		},
		[query],
	)

	const getSnapshot = () => window.matchMedia(query).matches

	const getServerSnapshot = () => {
		throw Error('useMediaQuery is a client-only hook')
	}

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const useBreakpoint = (breakpoint: Breakpoint) => useMediaQuery(breakpoints[breakpoint])

export type { Breakpoint }

export { breakpoints, useBreakpoint, useMediaQuery }
