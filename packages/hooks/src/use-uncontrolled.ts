import { useState } from 'react'

type UseUncontrolledOptions<T> = {
	value?: T
	defaultValue?: T
	finalValue?: T
	onChange?: (value: T, ...payload: unknown[]) => void
}

type UseUncontrolledReturnValue<T> = [T, (value: T, ...payload: unknown[]) => void, boolean]

const useUncontrolled = <T>({
	value,
	defaultValue,
	finalValue,
	onChange = () => {},
}: UseUncontrolledOptions<T>): UseUncontrolledReturnValue<T> => {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue !== undefined ? defaultValue : finalValue)

	const handleUncontrolledChange = (val: T, ...payload: unknown[]) => {
		setUncontrolledValue(val)
		onChange(val, ...payload)
	}

	if (value !== undefined) {
		return [value, onChange, true]
	}

	return [uncontrolledValue as T, handleUncontrolledChange, false]
}

export { useUncontrolled }

export type { UseUncontrolledOptions, UseUncontrolledReturnValue }
