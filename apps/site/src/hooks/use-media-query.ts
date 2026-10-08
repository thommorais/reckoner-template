'use client'
import { useEffect, useState } from 'react'

const MEDIA_QUERIES = {
	tablet: '(min-width: 768px)',
	desktop: '(min-width: 1024px)',
	mobile: '(max-width: 767px)',
} as const

type MediaQuery = Readonly<(typeof MEDIA_QUERIES)[keyof typeof MEDIA_QUERIES]>

const useMediaQuery = (query: MediaQuery) => {
	const [matches, setMatches] = useState<boolean>()

	useEffect(() => {
		const mediaQuery = window.matchMedia(query)
		const onChange = () => setMatches(mediaQuery.matches)
		mediaQuery.addEventListener('change', onChange, false)
		onChange()
		return () => mediaQuery.removeEventListener('change', onChange, false)
	}, [query])

	return matches
}

export { MEDIA_QUERIES, useMediaQuery }
