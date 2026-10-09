import { cleanup, renderHook } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDidUpdate } from './use-did-update'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useDidUpdate', () => {
	it('does not run on mount', () => {
		const fn = vi.fn()

		renderHook(() => useDidUpdate(fn, [1]))

		expect(fn).not.toHaveBeenCalled()
	})

	it('runs when a dependency changes', () => {
		const fn = vi.fn()
		const { rerender } = renderHook(({ dep }) => useDidUpdate(fn, [dep]), { initialProps: { dep: 1 } })

		rerender({ dep: 2 })

		expect(fn).toHaveBeenCalledTimes(1)

		rerender({ dep: 3 })

		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('does not run when dependencies are unchanged', () => {
		const fn = vi.fn()
		const { rerender } = renderHook(({ dep }) => useDidUpdate(fn, [dep]), { initialProps: { dep: 1 } })

		rerender({ dep: 1 })
		rerender({ dep: 1 })

		expect(fn).not.toHaveBeenCalled()
	})

	it('runs on every update without a dependency array but not on mount', () => {
		const fn = vi.fn()
		const { rerender } = renderHook(() => useDidUpdate(fn))

		expect(fn).not.toHaveBeenCalled()

		rerender()
		rerender()

		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('runs the returned cleanup before the next run and on unmount', () => {
		const cleanupFn = vi.fn()
		const fn = vi.fn(() => cleanupFn)
		const { rerender, unmount } = renderHook(({ dep }) => useDidUpdate(fn, [dep]), { initialProps: { dep: 1 } })

		rerender({ dep: 2 })

		expect(fn).toHaveBeenCalledTimes(1)
		expect(cleanupFn).not.toHaveBeenCalled()

		rerender({ dep: 3 })

		expect(fn).toHaveBeenCalledTimes(2)
		expect(cleanupFn).toHaveBeenCalledTimes(1)

		unmount()

		expect(cleanupFn).toHaveBeenCalledTimes(2)
	})

	it('does not run on mount under StrictMode', () => {
		const fn = vi.fn()

		renderHook(() => useDidUpdate(fn, [1]), { wrapper: StrictMode })

		expect(fn).not.toHaveBeenCalled()
	})

	it('does not run on mount under StrictMode without dependencies', () => {
		const fn = vi.fn()

		renderHook(() => useDidUpdate(fn), { wrapper: StrictMode })

		expect(fn).not.toHaveBeenCalled()
	})

	it('runs once per dependency change under StrictMode', () => {
		const fn = vi.fn()
		const { rerender } = renderHook(({ dep }) => useDidUpdate(fn, [dep]), {
			initialProps: { dep: 1 },
			wrapper: StrictMode,
		})

		rerender({ dep: 2 })

		expect(fn).toHaveBeenCalledTimes(1)
	})
})
