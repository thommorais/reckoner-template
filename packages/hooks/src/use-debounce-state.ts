import { type SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

type UseDebouncedStateOptions = {
	leading?: boolean
}

type UseDebouncedStateReturnValue<T> = [T, (newValue: SetStateAction<T>) => void]

const useDebouncedState = <T = unknown>(
	defaultValue: T,
	wait: number,
	{ leading = false }: UseDebouncedStateOptions = {},
): UseDebouncedStateReturnValue<T> => {
	const [value, setValue] = useState(defaultValue)
	const timeoutRef = useRef<number | undefined>(undefined)
	const leadingRef = useRef(true)

	const cancel = useCallback(() => window.clearTimeout(timeoutRef.current), [])

	useEffect(() => cancel, [cancel])

	const debouncedSetValue = useCallback(
		(newValue: SetStateAction<T>) => {
			cancel()
			if (leadingRef.current && leading) {
				setValue(newValue)
				timeoutRef.current = window.setTimeout(() => {
					leadingRef.current = true
				}, wait)
			} else {
				timeoutRef.current = window.setTimeout(() => {
					leadingRef.current = true
					setValue(newValue)
				}, wait)
			}
			leadingRef.current = false
		},
		[leading, cancel, wait],
	)

	return [value, debouncedSetValue]
}

export { useDebouncedState }
