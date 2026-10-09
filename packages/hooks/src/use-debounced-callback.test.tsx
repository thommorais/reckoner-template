import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type UseDebouncedCallbackOptions, useDebouncedCallback } from './use-debounced-callback'

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

describe('useDebouncedCallback', () => {
	it('calls the callback after the delay', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current('a')
		})
		advance(99)

		expect(callback).not.toHaveBeenCalled()

		advance(1)

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith('a')
	})

	it('collapses repeated calls into one call with the last arguments', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current('a', 1)
		})
		advance(50)
		act(() => {
			result.current('b', 2)
		})
		advance(50)

		expect(callback).not.toHaveBeenCalled()

		advance(50)

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith('b', 2)
	})

	it('accepts a number as the delay', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, 100))

		act(() => {
			result.current('a')
		})
		advance(99)

		expect(callback).not.toHaveBeenCalled()

		advance(1)

		expect(callback).toHaveBeenCalledWith('a')
	})

	it('calls immediately on the first call in leading mode', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, leading: true }))

		act(() => {
			result.current('a')
		})

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith('a')
		expect(result.current.isPending()).toBe(false)
	})

	it('does not call for later calls inside the window and flush invokes the latest args', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, leading: true }))

		act(() => {
			result.current('a')
		})
		advance(10)
		act(() => {
			result.current('b')
		})
		act(() => {
			result.current('c')
		})

		expect(callback).toHaveBeenCalledTimes(1)
		expect(result.current.isPending()).toBe(true)

		act(() => {
			result.current.flush()
		})

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenLastCalledWith('c')
		expect(result.current.isPending()).toBe(false)
	})

	it('calls immediately again after the leading window elapses', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, leading: true }))

		act(() => {
			result.current('a')
		})
		advance(100)
		act(() => {
			result.current('b')
		})

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenLastCalledWith('b')
	})

	it('forces a call at maxWait while calls keep resetting the delay', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, maxWait: 250 }))

		for (const value of [0, 1, 2, 3, 4]) {
			act(() => {
				result.current(value)
			})
			advance(50)
		}

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(4)
	})

	it('does not call before maxWait without it being reached', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, maxWait: 250 }))

		for (const value of [0, 1, 2, 3]) {
			act(() => {
				result.current(value)
			})
			advance(50)
		}

		expect(callback).not.toHaveBeenCalled()
	})

	it('flush calls immediately with the latest args and clears the pending state', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current('a')
			result.current('b')
		})
		act(() => {
			result.current.flush()
		})

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith('b')

		advance(200)

		expect(callback).toHaveBeenCalledTimes(1)
	})

	it('flush does nothing when nothing is pending', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current.flush()
		})

		expect(callback).not.toHaveBeenCalled()
	})

	it('cancel drops the pending call', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current('a')
		})
		act(() => {
			result.current.cancel()
		})
		advance(200)

		expect(callback).not.toHaveBeenCalled()
		expect(result.current.isPending()).toBe(false)
	})

	it('cancel also drops the maxWait call', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100, maxWait: 250 }))

		act(() => {
			result.current('a')
		})
		act(() => {
			result.current.cancel()
		})
		advance(500)

		expect(callback).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('reports isPending from call until the delay elapses', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		expect(result.current.isPending()).toBe(false)

		act(() => {
			result.current('a')
		})

		expect(result.current.isPending()).toBe(true)

		advance(100)

		expect(result.current.isPending()).toBe(false)
	})

	it('flushes the pending call on unmount when flushOnUnmount is true', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, { delay: 100, flushOnUnmount: true }))

		act(() => {
			result.current('a')
		})
		unmount()

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith('a')
	})

	it('drops the pending call on unmount when flushOnUnmount is false', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, { delay: 100 }))

		act(() => {
			result.current('a')
		})
		unmount()
		advance(200)

		expect(callback).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('uses the latest callback without resetting the timer or recreating the debounced function', () => {
		vi.useFakeTimers()
		const first = vi.fn()
		const second = vi.fn()
		const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, { delay: 100 }), {
			initialProps: { callback: first },
		})
		const debounced = result.current

		act(() => {
			result.current('a')
		})
		advance(50)
		rerender({ callback: second })

		expect(result.current).toBe(debounced)

		advance(49)

		expect(second).not.toHaveBeenCalled()

		advance(1)

		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
		expect(second).toHaveBeenCalledWith('a')
	})

	it('keeps the debounced function stable when options are unchanged', () => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result, rerender } = renderHook(
			({ options }: { options: UseDebouncedCallbackOptions }) => useDebouncedCallback(callback, options),
			{ initialProps: { options: { delay: 100, leading: false, maxWait: 300 } } },
		)
		const debounced = result.current

		rerender({ options: { delay: 100, leading: false, maxWait: 300 } })

		expect(result.current).toBe(debounced)
	})

	it('keeps the debounced function stable with the number shorthand', () => {
		vi.useFakeTimers()
		const { result, rerender } = renderHook(() => useDebouncedCallback(vi.fn(), 100))
		const debounced = result.current

		rerender()

		expect(result.current).toBe(debounced)
	})

	it.each([
		['delay', { delay: 200 }],
		['leading', { delay: 100, leading: true }],
		['maxWait', { delay: 100, maxWait: 500 }],
	])('creates a new debounced function when %s changes', (_name, next) => {
		vi.useFakeTimers()
		const callback = vi.fn()
		const { result, rerender } = renderHook(
			({ options }: { options: UseDebouncedCallbackOptions }) => useDebouncedCallback(callback, options),
			{ initialProps: { options: { delay: 100 } } },
		)
		const debounced = result.current

		rerender({ options: next })

		expect(result.current).not.toBe(debounced)
	})
})
