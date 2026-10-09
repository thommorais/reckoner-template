import { act, cleanup, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWindowScroll } from './use-window-scroll'

const originalX = Object.getOwnPropertyDescriptor(window, 'scrollX')
const originalY = Object.getOwnPropertyDescriptor(window, 'scrollY')

const setScroll = (x: number, y: number) => {
	Object.defineProperty(window, 'scrollX', { configurable: true, value: x })
	Object.defineProperty(window, 'scrollY', { configurable: true, value: y })
}

const restore = (key: string, descriptor: PropertyDescriptor | undefined) => {
	if (descriptor) {
		Object.defineProperty(window, key, descriptor)
		return
	}

	Reflect.deleteProperty(window, key)
}

afterEach(() => {
	cleanup()
	restore('scrollX', originalX)
	restore('scrollY', originalY)
	vi.restoreAllMocks()
})

describe('useWindowScroll', () => {
	it('returns the current scroll position', () => {
		setScroll(12, 34)

		const { result } = renderHook(() => useWindowScroll())

		expect(result.current[0]).toEqual({ x: 12, y: 34 })
	})

	it('updates on scroll', () => {
		setScroll(0, 0)

		const { result } = renderHook(() => useWindowScroll())

		act(() => {
			setScroll(5, 100)
			window.dispatchEvent(new Event('scroll'))
		})

		expect(result.current[0]).toEqual({ x: 5, y: 100 })
	})

	it('updates on resize', () => {
		setScroll(0, 0)

		const { result } = renderHook(() => useWindowScroll())

		act(() => {
			setScroll(0, 50)
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current[0]).toEqual({ x: 0, y: 50 })
	})

	it('keeps the position reference when the scroll did not change', () => {
		setScroll(1, 2)

		const { result, rerender } = renderHook(() => useWindowScroll())
		const first = result.current[0]

		rerender()
		act(() => {
			window.dispatchEvent(new Event('scroll'))
		})

		expect(result.current[0]).toBe(first)
	})

	it('returns a stable scrollTo', () => {
		setScroll(0, 0)

		const { result, rerender } = renderHook(() => useWindowScroll())
		const first = result.current[1]

		act(() => {
			setScroll(0, 10)
			window.dispatchEvent(new Event('scroll'))
		})
		rerender()

		expect(result.current[1]).toBe(first)
	})

	it('registers passive scroll and resize listeners', () => {
		const addSpy = vi.spyOn(window, 'addEventListener')

		renderHook(() => useWindowScroll())

		expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
		expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })
	})

	it('removes listeners on unmount', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener')

		const { unmount } = renderHook(() => useWindowScroll())
		unmount()

		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
	})

	it('does not update after unmount', () => {
		setScroll(0, 0)

		const { result, unmount } = renderHook(() => useWindowScroll())
		unmount()
		setScroll(0, 99)
		window.dispatchEvent(new Event('scroll'))

		expect(result.current[0]).toEqual({ x: 0, y: 0 })
	})

	it('scrollTo scrolls smoothly on both axes', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

		const { result } = renderHook(() => useWindowScroll())
		result.current[1]({ x: 10, y: 20 })

		expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', left: 10, top: 20 })
	})

	it('scrollTo omits an axis that is not provided', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

		const { result } = renderHook(() => useWindowScroll())
		result.current[1]({ y: 20 })

		expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', top: 20 })
	})

	it('scrollTo keeps a zero coordinate', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

		const { result } = renderHook(() => useWindowScroll())
		result.current[1]({ x: 0, y: 0 })

		expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 0 })
	})

	it('renders 0,0 on the server', () => {
		setScroll(7, 8)

		const Probe = () => {
			const [{ x, y }] = useWindowScroll()
			return createElement('span', null, `${x}-${y}`)
		}

		expect(renderToString(createElement(Probe))).toContain('0-0')
	})
})
