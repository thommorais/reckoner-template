import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCallbackRef } from './use-callback-ref'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useCallbackRef', () => {
	it('forwards arguments and return value to the callback', () => {
		const callback = vi.fn((a: number, b: number) => a + b)
		const { result } = renderHook(() => useCallbackRef(callback))

		expect(result.current(1, 2)).toBe(3)
		expect(callback).toHaveBeenCalledWith(1, 2)
	})

	it('keeps a stable identity across renders and callback changes', () => {
		const { result, rerender } = renderHook(({ callback }) => useCallbackRef(callback), {
			initialProps: { callback: (): number => 1 },
		})
		const first = result.current

		rerender({ callback: (): number => 2 })

		expect(result.current).toBe(first)
	})

	it('invokes the latest callback after a rerender', () => {
		const first = vi.fn()
		const second = vi.fn()
		const { result, rerender } = renderHook(({ callback }) => useCallbackRef(callback), {
			initialProps: { callback: first },
		})

		rerender({ callback: second })
		result.current()

		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('returns undefined when the callback is undefined', () => {
		const { result } = renderHook(() => useCallbackRef<() => number>(undefined))

		expect(result.current()).toBeUndefined()
	})

	it('starts calling a callback supplied after an undefined one', () => {
		const callback = vi.fn()
		const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
			initialProps: { cb: undefined as (() => void) | undefined },
		})

		rerender({ cb: callback })
		result.current()

		expect(callback).toHaveBeenCalledTimes(1)
	})
})
