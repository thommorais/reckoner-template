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
	const [value, setValue] = useState<T>(initialValue)
	const [lastValidValue, setLastValidValue] = useState<T | undefined>(validate(initialValue) ? initialValue : undefined)
	const [valid, setValid] = useState<boolean>(
		typeof initialValidationState === 'boolean' ? initialValidationState : validate(initialValue),
	)

	const onChange = useCallback(
		(val: T) => {
			if (validate(val)) {
				setLastValidValue(val)
				setValid(true)
			} else {
				setValid(false)
			}

			setValue(val)
		},
		[validate],
	)

	return [{ value, lastValidValue, valid }, onChange] as const
}

export namespace useValidatedState {
	export type ReturnValue<T> = UseValidatedStateReturnValue<T>
}

export { useValidatedState }
