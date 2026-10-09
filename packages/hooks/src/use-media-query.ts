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

const getServerSnapshot = (): boolean => {
	throw new Error('useMediaQuery is a client-only hook')
}

const useMediaQuery = (query: BreakpointValue | string) => {
	const subscribe = useCallback(
		(callback: () => void) => {
			const mediaQueryList = window.matchMedia(query)
			mediaQueryList.addEventListener('change', callback)
			return () => mediaQueryList.removeEventListener('change', callback)
		},
		[query],
	)

	const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const useBreakpoint = (breakpoint: Breakpoint) => useMediaQuery(breakpoints[breakpoint])

export { breakpoints, useBreakpoint, useMediaQuery }

export type { Breakpoint }
