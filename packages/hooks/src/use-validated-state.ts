import { useCallback, useState } from 'react'

type UseValidatedStateValue<T> = {
	value: T
	lastValidValue: T | undefined
	valid: boolean
}

type UseValidatedStateReturnValue<T> = [UseValidatedStateValue<T>, (value: T) => void]

const useValidatedState = <T>(
	initialValue: T,
	validate: (value: T) => boolean,
	initialValidationState?: boolean,
): UseValidatedStateReturnValue<T> => {
	const [state, setState] = useState<UseValidatedStateValue<T>>(() => {
		const valid = validate(initialValue)

		return {
			value: initialValue,
			lastValidValue: valid ? initialValue : undefined,
			valid: initialValidationState ?? valid,
		}
	})

	const onChange = useCallback(
		(value: T) => {
			const valid = validate(value)

			setState(previous => ({
				value,
				lastValidValue: valid ? value : previous.lastValidValue,
				valid,
			}))
		},
		[validate],
	)

	return [state, onChange]
}

export { useValidatedState }

export type { UseValidatedStateReturnValue, UseValidatedStateValue }
