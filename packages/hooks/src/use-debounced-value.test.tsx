import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './use-debounced-value'

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.restoreAllMocks()
})

const advance = (ms: number) => {
	act(() => {
		vi.advanceTimersByTime(ms)
	})
}

describe('useDebouncedValue', () => {
	it('returns the initial value on first render without scheduling', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedValue('a', 100))

		expect(result.current[0]).toBe('a')
		expect(vi.getTimerCount()).toBe(0)
	})

	it('updates after the wait', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		advance(99)

		expect(result.current[0]).toBe('a')

		advance(1)

		expect(result.current[0]).toBe('b')
	})

	it('collapses rapid changes into the last value', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		advance(60)
		rerender({ value: 'c' })
		advance(60)

		expect(result.current[0]).toBe('a')

		advance(40)

		expect(result.current[0]).toBe('c')
	})

	it('updates immediately on the first change in leading mode', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })

		expect(result.current[0]).toBe('b')
	})

	it('debounces changes inside the leading cooldown', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		advance(10)
		rerender({ value: 'c' })

		expect(result.current[0]).toBe('b')

		advance(100)

		expect(result.current[0]).toBe('c')
	})

	it('updates immediately again after the leading cooldown elapses', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		advance(100)
		rerender({ value: 'c' })

		expect(result.current[0]).toBe('c')
	})

	it('cancel drops the pending update', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		act(() => {
			result.current[1]()
		})
		advance(200)

		expect(result.current[0]).toBe('a')
	})

	it('exposes cancel in the handlers object', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		act(() => {
			result.current[2].cancel()
		})
		advance(200)

		expect(result.current[0]).toBe('a')
	})

	it('flush applies the pending value immediately', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		rerender({ value: 'c' })
		act(() => {
			result.current[2].flush()
		})

		expect(result.current[0]).toBe('c')
		expect(vi.getTimerCount()).toBe(0)
	})

	it('flush does nothing when nothing is pending', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedValue('a', 100))

		act(() => {
			result.current[2].flush()
		})

		expect(result.current[0]).toBe('a')
	})

	it('clears the pending timer on unmount', () => {
		vi.useFakeTimers()
		const { rerender, unmount } = renderHook(({ value }) => useDebouncedValue(value, 100), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })

		expect(vi.getTimerCount()).toBe(1)

		unmount()

		expect(vi.getTimerCount()).toBe(0)
	})
})
