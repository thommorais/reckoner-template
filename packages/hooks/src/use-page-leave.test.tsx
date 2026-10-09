import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePageLeave } from './use-page-leave'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('usePageLeave', () => {
	it('calls the callback on mouseleave of the document element', () => {
		const onLeave = vi.fn()

		renderHook(() => usePageLeave(onLeave))
		document.documentElement.dispatchEvent(new Event('mouseleave'))

		expect(onLeave).toHaveBeenCalledTimes(1)
	})

	it('ignores mouseleave on other elements', () => {
		const onLeave = vi.fn()

		renderHook(() => usePageLeave(onLeave))
		document.body.dispatchEvent(new Event('mouseleave'))

		expect(onLeave).not.toHaveBeenCalled()
	})

	it('uses the latest callback without resubscribing', () => {
		const first = vi.fn()
		const second = vi.fn()
		const addSpy = vi.spyOn(document.documentElement, 'addEventListener')

		const { rerender } = renderHook(({ cb }) => usePageLeave(cb), { initialProps: { cb: first } })
		const addsBefore = addSpy.mock.calls.length

		rerender({ cb: second })
		document.documentElement.dispatchEvent(new Event('mouseleave'))

		expect(addSpy.mock.calls.length).toBe(addsBefore)
		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('removes the same listener on unmount', () => {
		const onLeave = vi.fn()
		const addSpy = vi.spyOn(document.documentElement, 'addEventListener')
		const removeSpy = vi.spyOn(document.documentElement, 'removeEventListener')

		const { unmount } = renderHook(() => usePageLeave(onLeave))
		const added = addSpy.mock.calls.find(call => call[0] === 'mouseleave')?.[1]
		unmount()

		expect(removeSpy).toHaveBeenCalledWith('mouseleave', added)
	})

	it('does not call the callback after unmount', () => {
		const onLeave = vi.fn()

		const { unmount } = renderHook(() => usePageLeave(onLeave))
		unmount()
		document.documentElement.dispatchEvent(new Event('mouseleave'))

		expect(onLeave).not.toHaveBeenCalled()
	})

	it('fires on every leave', () => {
		const onLeave = vi.fn()

		renderHook(() => usePageLeave(onLeave))
		document.documentElement.dispatchEvent(new Event('mouseleave'))
		document.documentElement.dispatchEvent(new Event('mouseleave'))

		expect(onLeave).toHaveBeenCalledTimes(2)
	})
})
