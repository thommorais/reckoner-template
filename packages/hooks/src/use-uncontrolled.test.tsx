import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useUncontrolled } from './use-uncontrolled'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useUncontrolled', () => {
	describe('uncontrolled', () => {
		it('starts with defaultValue', () => {
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a' }))

			expect(result.current[0]).toBe('a')
		})

		it('starts with finalValue when defaultValue is undefined', () => {
			const { result } = renderHook(() => useUncontrolled({ finalValue: 'fallback' }))

			expect(result.current[0]).toBe('fallback')
		})

		it('prefers defaultValue over finalValue', () => {
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a', finalValue: 'fallback' }))

			expect(result.current[0]).toBe('a')
		})

		it('keeps falsy defaultValue instead of falling back to finalValue', () => {
			const zero = renderHook(() => useUncontrolled({ defaultValue: 0, finalValue: 5 }))
			const empty = renderHook(() => useUncontrolled({ defaultValue: '', finalValue: 'x' }))
			const no = renderHook(() => useUncontrolled({ defaultValue: false, finalValue: true }))

			expect(zero.result.current[0]).toBe(0)
			expect(empty.result.current[0]).toBe('')
			expect(no.result.current[0]).toBe(false)
		})

		it('is undefined when no value, defaultValue or finalValue is given', () => {
			const { result } = renderHook(() => useUncontrolled<string>({}))

			expect(result.current[0]).toBeUndefined()
		})

		it('updates its own state on change', () => {
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a' }))

			act(() => result.current[1]('b'))

			expect(result.current[0]).toBe('b')
		})

		it('calls onChange with the value', () => {
			const onChange = vi.fn()
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a', onChange }))

			act(() => result.current[1]('b'))

			expect(onChange).toHaveBeenCalledTimes(1)
			expect(onChange).toHaveBeenCalledWith('b')
		})

		it('forwards extra payload to onChange', () => {
			const onChange = vi.fn()
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a', onChange }))
			const payload = { source: 'keyboard' }

			act(() => result.current[1]('b', payload, 42))

			expect(onChange).toHaveBeenCalledWith('b', payload, 42)
		})

		it('changes without onChange', () => {
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 1 }))

			expect(() => act(() => result.current[1](2))).not.toThrow()
			expect(result.current[0]).toBe(2)
		})

		it('reports false as the third item', () => {
			const { result } = renderHook(() => useUncontrolled({ defaultValue: 'a' }))

			expect(result.current[2]).toBe(false)
		})

		it('ignores a later change of defaultValue', () => {
			const { result, rerender } = renderHook(({ defaultValue }) => useUncontrolled({ defaultValue }), {
				initialProps: { defaultValue: 'a' },
			})

			rerender({ defaultValue: 'z' })

			expect(result.current[0]).toBe('a')
		})
	})

	describe('controlled', () => {
		it('returns value', () => {
			const { result } = renderHook(() => useUncontrolled({ value: 'v' }))

			expect(result.current[0]).toBe('v')
		})

		it('prefers value over defaultValue and finalValue', () => {
			const { result } = renderHook(() => useUncontrolled({ value: 'v', defaultValue: 'd', finalValue: 'f' }))

			expect(result.current[0]).toBe('v')
		})

		it('treats falsy and null values as controlled', () => {
			const zero = renderHook(() => useUncontrolled({ value: 0, defaultValue: 5 }))
			const nullish = renderHook(() => useUncontrolled<string | null>({ value: null, defaultValue: 'd' }))

			expect(zero.result.current[0]).toBe(0)
			expect(zero.result.current[2]).toBe(true)
			expect(nullish.result.current[0]).toBeNull()
			expect(nullish.result.current[2]).toBe(true)
		})

		it('reports true as the third item', () => {
			const { result } = renderHook(() => useUncontrolled({ value: 'v' }))

			expect(result.current[2]).toBe(true)
		})

		it('does not change the value on change, only calls onChange', () => {
			const onChange = vi.fn()
			const { result } = renderHook(() => useUncontrolled({ value: 'v', onChange }))

			act(() => result.current[1]('next'))

			expect(result.current[0]).toBe('v')
			expect(onChange).toHaveBeenCalledWith('next')
		})

		it('forwards extra payload to onChange', () => {
			const onChange = vi.fn()
			const { result } = renderHook(() => useUncontrolled({ value: 'v', onChange }))

			act(() => result.current[1]('next', 'a', 'b'))

			expect(onChange).toHaveBeenCalledWith('next', 'a', 'b')
		})

		it('does not throw on change without onChange', () => {
			const { result } = renderHook(() => useUncontrolled({ value: 'v' }))

			expect(() => act(() => result.current[1]('next'))).not.toThrow()
			expect(result.current[0]).toBe('v')
		})

		it('follows value changes from the parent', () => {
			const { result, rerender } = renderHook(({ value }) => useUncontrolled({ value }), {
				initialProps: { value: 'a' },
			})

			rerender({ value: 'b' })

			expect(result.current[0]).toBe('b')
		})

		it('switches to the uncontrolled state when value becomes undefined', () => {
			const { result, rerender } = renderHook(
				({ value }: { value?: string }) => useUncontrolled({ value, defaultValue: 'd' }),
				{
					initialProps: { value: 'v' } as { value?: string },
				},
			)

			rerender({ value: undefined })

			expect(result.current[0]).toBe('d')
			expect(result.current[2]).toBe(false)
		})
	})
})
