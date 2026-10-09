import type { ANY } from '@thom/libs/types'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseDebouncedValueOptions = {
	leading?: boolean
}

type UseDebouncedValueHandlers = {
	cancel: () => void
	flush: () => void
}

type UseDebouncedValueReturnValue<T> = [T, () => void, UseDebouncedValueHandlers]

const useDebouncedValue = <T = ANY>(
	value: T,
	wait: number,
	{ leading = false }: UseDebouncedValueOptions = {},
): UseDebouncedValueReturnValue<T> => {
	const [debounced, setDebounced] = useState(value)
	const isMountedRef = useRef(false)
	const timeoutRef = useRef<number | undefined>(undefined)
	const cooldownRef = useRef(false)
	const latestValueRef = useRef(value)

	useEffect(() => {
		latestValueRef.current = value
	})

	const cancel = useCallback(() => {
		window.clearTimeout(timeoutRef.current)
		timeoutRef.current = undefined
		cooldownRef.current = false
	}, [])

	const flush = useCallback(() => {
		if (timeoutRef.current !== undefined) {
			cancel()
			setDebounced(latestValueRef.current)
		}
	}, [cancel])

	useEffect(() => {
		if (!isMountedRef.current) {
			return
		}

		window.clearTimeout(timeoutRef.current)

		if (leading && !cooldownRef.current) {
			cooldownRef.current = true
			setDebounced(value)
			timeoutRef.current = window.setTimeout(() => {
				cooldownRef.current = false
			}, wait)
		} else {
			timeoutRef.current = window.setTimeout(() => {
				cooldownRef.current = false
				setDebounced(value)
			}, wait)
		}
	}, [value, leading, wait])

	useEffect(() => {
		isMountedRef.current = true
		return cancel
	}, [cancel])

	return [debounced, cancel, { cancel, flush }]
}

export { useDebouncedValue }

export type { UseDebouncedValueHandlers, UseDebouncedValueOptions, UseDebouncedValueReturnValue }
