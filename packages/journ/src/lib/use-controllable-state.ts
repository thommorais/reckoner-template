import { useCallback, useState } from 'react'

const useControllableState = <T>(
	value: T | null | undefined,
	defaultValue: T | null,
	onChange?: (value: T) => void,
): readonly [T | null, (next: T) => void] => {
	const [uncontrolled, setUncontrolled] = useState(defaultValue)
	const controlled = value !== undefined

	const setValue = useCallback(
		(next: T) => {
			if (!controlled) setUncontrolled(next)
			onChange?.(next)
		},
		[controlled, onChange],
	)

	return [controlled ? value : uncontrolled, setValue] as const
}

export { useControllableState }
