import { useEffect, useRef, useState } from 'react'

interface UseMediaQueryOptions {
	getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Attach media query listener using modern addEventListener API
 * */
const attachMediaListener = (query: MediaQueryList, callback: MediaQueryCallback) => {
	query.addEventListener('change', callback)
	return () => query.removeEventListener('change', callback)
}

const getInitialValue = (query: string, initialValue?: boolean) => {
	if (typeof initialValue === 'boolean') {
		return initialValue
	}

	if (typeof window !== 'undefined' && 'matchMedia' in window) {
		return window.matchMedia(query).matches
	}

	return false
}

const useMediaQuery = (
	query: string,
	initialValue?: boolean,
	{ getInitialValueInEffect }: UseMediaQueryOptions = {
		getInitialValueInEffect: true,
	},
) => {
	const [matches, setMatches] = useState(getInitialValueInEffect ? initialValue : getInitialValue(query, initialValue))
	const queryRef = useRef<MediaQueryList>(null)

	useEffect(() => {
		if ('matchMedia' in window) {
			queryRef.current = window.matchMedia(query)
			setMatches(queryRef.current.matches)
			return attachMediaListener(queryRef.current, event => setMatches(event.matches))
		}

		return undefined
	}, [query])

	return matches
}

export { useMediaQuery }
export type { UseMediaQueryOptions }
