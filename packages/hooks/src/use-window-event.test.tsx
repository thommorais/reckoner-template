import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWindowEvent } from './use-window-event'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useWindowEvent', () => {
	it('calls the listener when the event fires', () => {
		const listener = vi.fn()

		renderHook(() => useWindowEvent('resize', listener))
		window.dispatchEvent(new Event('resize'))

		expect(listener).toHaveBeenCalledTimes(1)
		expect(listener.mock.calls[0]?.[0]).toBeInstanceOf(Event)
	})

	it('ignores other event types', () => {
		const listener = vi.fn()

		renderHook(() => useWindowEvent('resize', listener))
		window.dispatchEvent(new Event('scroll'))

		expect(listener).not.toHaveBeenCalled()
	})

	it('supports custom events', () => {
		const listener = vi.fn()

		renderHook(() => useWindowEvent('my-event', listener))
		window.dispatchEvent(new CustomEvent('my-event', { detail: 42 }))

		expect(listener.mock.calls[0]?.[0].detail).toBe(42)
	})

	it('removes the listener on unmount', () => {
		const listener = vi.fn()
		const removeSpy = vi.spyOn(window, 'removeEventListener')

		const { unmount } = renderHook(() => useWindowEvent('resize', listener))
		unmount()
		window.dispatchEvent(new Event('resize'))

		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined)
		expect(listener).not.toHaveBeenCalled()
	})

	it('removes the same function it added', () => {
		const addSpy = vi.spyOn(window, 'addEventListener')
		const removeSpy = vi.spyOn(window, 'removeEventListener')

		const { unmount } = renderHook(() => useWindowEvent('resize', vi.fn()))
		const added = addSpy.mock.calls.find(call => call[0] === 'resize')?.[1]
		unmount()

		expect(removeSpy).toHaveBeenCalledWith('resize', added, undefined)
	})

	it('uses the latest listener without resubscribing', () => {
		const first = vi.fn()
		const second = vi.fn()
		const addSpy = vi.spyOn(window, 'addEventListener')

		const { rerender } = renderHook(({ listener }) => useWindowEvent('resize', listener), {
			initialProps: { listener: first },
		})
		const addsBefore = addSpy.mock.calls.filter(call => call[0] === 'resize').length

		rerender({ listener: second })
		window.dispatchEvent(new Event('resize'))

		expect(addSpy.mock.calls.filter(call => call[0] === 'resize').length).toBe(addsBefore)
		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('resubscribes when the type changes', () => {
		const listener = vi.fn()

		const { rerender } = renderHook(({ type }) => useWindowEvent(type, listener), {
			initialProps: { type: 'resize' },
		})
		rerender({ type: 'scroll' })

		window.dispatchEvent(new Event('resize'))
		expect(listener).not.toHaveBeenCalled()

		window.dispatchEvent(new Event('scroll'))
		expect(listener).toHaveBeenCalledTimes(1)
	})

	it('forwards options to addEventListener', () => {
		const addSpy = vi.spyOn(window, 'addEventListener')
		const options = { passive: true }

		renderHook(() => useWindowEvent('scroll', vi.fn(), options))

		expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), options)
	})

	it('honours the once option', () => {
		const listener = vi.fn()
		const options = { once: true }

		renderHook(() => useWindowEvent('resize', listener, options))
		window.dispatchEvent(new Event('resize'))
		window.dispatchEvent(new Event('resize'))

		expect(listener).toHaveBeenCalledTimes(1)
	})
})
