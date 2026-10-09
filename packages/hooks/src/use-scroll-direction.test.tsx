import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useScrollDirection } from './use-scroll-direction'

const originalY = Object.getOwnPropertyDescriptor(window, 'scrollY')

const scrollTo = (y: number) => {
	Object.defineProperty(window, 'scrollY', { configurable: true, value: y })
	act(() => {
		window.dispatchEvent(new Event('scroll'))
	})
}

beforeEach(() => {
	vi.useFakeTimers()
	Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.restoreAllMocks()
	if (originalY) {
		Object.defineProperty(window, 'scrollY', originalY)
	} else {
		Reflect.deleteProperty(window, 'scrollY')
	}
})

describe('useScrollDirection', () => {
	it('starts unknown', () => {
		const { result } = renderHook(() => useScrollDirection())

		expect(result.current).toBe('unknown')
	})

	it('reports down when scrolling down', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)

		expect(result.current).toBe('down')
	})

	it('reports up when scrolling up', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		scrollTo(40)

		expect(result.current).toBe('up')
	})

	it('flips back to down', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		scrollTo(40)
		scrollTo(80)

		expect(result.current).toBe('down')
	})

	it('falls back to documentElement.scrollTop when scrollY is 0', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		document.documentElement.scrollTop = 30
		scrollTo(0)

		expect(result.current).toBe('up')
	})

	it('ignores scroll events while resizing', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		act(() => {
			window.dispatchEvent(new Event('resize'))
		})
		scrollTo(20)

		expect(result.current).toBe('down')
	})

	it('resumes tracking 300ms after the last resize', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		act(() => {
			window.dispatchEvent(new Event('resize'))
		})
		act(() => {
			vi.advanceTimersByTime(299)
		})
		scrollTo(20)
		expect(result.current).toBe('down')

		act(() => {
			vi.advanceTimersByTime(1)
		})
		scrollTo(10)

		expect(result.current).toBe('up')
	})

	it('restarts the debounce on repeated resizes', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		act(() => {
			window.dispatchEvent(new Event('resize'))
			vi.advanceTimersByTime(200)
			window.dispatchEvent(new Event('resize'))
			vi.advanceTimersByTime(200)
		})
		scrollTo(20)

		expect(result.current).toBe('down')

		act(() => {
			vi.advanceTimersByTime(100)
		})
		scrollTo(10)

		expect(result.current).toBe('up')
	})

	it('does not record the scroll position while resizing', () => {
		const { result } = renderHook(() => useScrollDirection())

		scrollTo(100)
		act(() => {
			window.dispatchEvent(new Event('resize'))
		})
		scrollTo(20)
		act(() => {
			vi.advanceTimersByTime(300)
		})
		scrollTo(60)

		expect(result.current).toBe('up')
	})

	it('removes listeners and clears the timer on unmount', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener')
		const clearSpy = vi.spyOn(globalThis, 'clearTimeout')

		const { unmount } = renderHook(() => useScrollDirection())
		unmount()

		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
		expect(clearSpy).toHaveBeenCalled()
	})

	it('does not update after unmount', () => {
		const { result, unmount } = renderHook(() => useScrollDirection())
		unmount()

		Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
		window.dispatchEvent(new Event('scroll'))

		expect(result.current).toBe('unknown')
	})
})
