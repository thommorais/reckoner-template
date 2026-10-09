import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedState } from './use-debounce-state'

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

describe('useDebouncedState', () => {
	it('returns the default value on first render', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100))

		expect(result.current[0]).toBe('a')
	})

	it('updates after the wait', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100))

		act(() => {
			result.current[1]('b')
		})
		advance(99)

		expect(result.current[0]).toBe('a')

		advance(1)

		expect(result.current[0]).toBe('b')
	})

	it('collapses repeated calls into the last value', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100))

		act(() => {
			result.current[1]('b')
		})
		advance(50)
		act(() => {
			result.current[1]('c')
		})
		advance(99)

		expect(result.current[0]).toBe('a')

		advance(1)

		expect(result.current[0]).toBe('c')
	})

	it('supports functional updates', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState(1, 100))

		act(() => {
			result.current[1](previous => previous + 1)
		})
		advance(100)

		expect(result.current[0]).toBe(2)
	})

	it('applies the first call immediately in leading mode', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100, { leading: true }))

		act(() => {
			result.current[1]('b')
		})

		expect(result.current[0]).toBe('b')
	})

	it('debounces calls after the leading one in leading mode', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100, { leading: true }))

		act(() => {
			result.current[1]('b')
		})
		advance(10)
		act(() => {
			result.current[1]('c')
		})
		act(() => {
			result.current[1]('d')
		})

		expect(result.current[0]).toBe('b')

		advance(100)

		expect(result.current[0]).toBe('d')
	})

	it('applies functional updates immediately in leading mode', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState(1, 100, { leading: true }))

		act(() => {
			result.current[1](previous => previous + 1)
		})

		expect(result.current[0]).toBe(2)
	})

	it('applies a new leading call immediately once the wait has elapsed', () => {
		vi.useFakeTimers()
		const { result } = renderHook(() => useDebouncedState('a', 100, { leading: true }))

		act(() => {
			result.current[1]('b')
		})
		advance(500)
		act(() => {
			result.current[1]('c')
		})

		expect(result.current[0]).toBe('c')
	})

	it('does not apply a pending update after unmount', () => {
		vi.useFakeTimers()
		const { result, unmount } = renderHook(() => useDebouncedState('a', 100))

		act(() => {
			result.current[1]('b')
		})
		unmount()

		expect(vi.getTimerCount()).toBe(0)
	})
})
