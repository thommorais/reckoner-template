import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useValidatedState } from './use-validated-state'

const isPositive = (value: number) => value > 0

afterEach(() => {
	cleanup()
})

describe('useValidatedState', () => {
	it('starts valid with a valid initial value', () => {
		const { result } = renderHook(() => useValidatedState<number>(1, isPositive))

		expect(result.current[0]).toEqual({ value: 1, lastValidValue: 1, valid: true })
	})

	it('starts invalid without a last valid value for an invalid initial value', () => {
		const { result } = renderHook(() => useValidatedState<number>(-1, isPositive))

		expect(result.current[0]).toEqual({ value: -1, lastValidValue: undefined, valid: false })
	})

	it('lets initialValidationState override the computed validity', () => {
		const { result } = renderHook(() => useValidatedState<number>(-1, isPositive, true))

		expect(result.current[0].valid).toBe(true)
		expect(result.current[0].lastValidValue).toBeUndefined()
	})

	it('lets initialValidationState false override a valid value', () => {
		const { result } = renderHook(() => useValidatedState<number>(1, isPositive, false))

		expect(result.current[0].valid).toBe(false)
		expect(result.current[0].lastValidValue).toBe(1)
	})

	it('records a valid change as the value and the last valid value', () => {
		const { result } = renderHook(() => useValidatedState<number>(1, isPositive))

		act(() => result.current[1](5))

		expect(result.current[0]).toEqual({ value: 5, lastValidValue: 5, valid: true })
	})

	it('keeps the last valid value when an invalid change arrives', () => {
		const { result } = renderHook(() => useValidatedState<number>(1, isPositive))

		act(() => result.current[1](-3))

		expect(result.current[0]).toEqual({ value: -3, lastValidValue: 1, valid: false })
	})

	it('recovers validity when a valid value follows an invalid one', () => {
		const { result } = renderHook(() => useValidatedState<number>(1, isPositive))

		act(() => result.current[1](-3))
		act(() => result.current[1](2))

		expect(result.current[0]).toEqual({ value: 2, lastValidValue: 2, valid: true })
	})

	it('validates the incoming value with the latest validator', () => {
		const { result, rerender } = renderHook(({ validate }) => useValidatedState<number>(1, validate), {
			initialProps: { validate: isPositive },
		})

		rerender({ validate: (value: number) => value > 10 })
		act(() => result.current[1](5))

		expect(result.current[0].valid).toBe(false)
	})

	it('returns the same state object across rerenders without changes', () => {
		const { result, rerender } = renderHook(() => useValidatedState<number>(1, isPositive))
		const first = result.current[0]

		rerender()

		expect(result.current[0]).toBe(first)
	})

	it('keeps onChange stable while the validator is stable', () => {
		const { result, rerender } = renderHook(() => useValidatedState<number>(1, isPositive))
		const first = result.current[1]

		rerender()

		expect(result.current[1]).toBe(first)
	})

	it('validates the initial value once, not on every render', () => {
		const validate = vi.fn(isPositive)
		const { rerender } = renderHook(() => useValidatedState<number>(1, validate))

		rerender()
		rerender()

		expect(validate).toHaveBeenCalledTimes(1)
	})
})
