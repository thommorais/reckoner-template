import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useReducedMotion } from './use-reduced-motion'

const QUERY = '(prefers-reduced-motion: reduce)'

const installMatchMedia = (matches: boolean) => {
	const listeners = new Set<() => void>()
	const list = {
		matches,
		addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
		removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
	}
	const matchMedia = vi.fn(() => list)

	vi.stubGlobal('matchMedia', matchMedia)

	return {
		list,
		listeners,
		matchMedia,
		change: (next: boolean) => {
			list.matches = next
			for (const listener of listeners) {
				listener()
			}
		},
	}
}

afterEach(() => {
	cleanup()
	vi.unstubAllGlobals()
})

describe('useReducedMotion', () => {
	it('queries prefers-reduced-motion', () => {
		const { matchMedia } = installMatchMedia(false)

		renderHook(() => useReducedMotion())

		expect(matchMedia).toHaveBeenCalledWith(QUERY)
	})

	it('is true when the user prefers reduced motion', () => {
		installMatchMedia(true)

		const { result } = renderHook(() => useReducedMotion())

		expect(result.current).toBe(true)
	})

	it('is false otherwise', () => {
		installMatchMedia(false)

		const { result } = renderHook(() => useReducedMotion())

		expect(result.current).toBe(false)
	})

	it('updates when the preference changes', () => {
		const { change } = installMatchMedia(false)

		const { result } = renderHook(() => useReducedMotion())

		act(() => change(true))
		expect(result.current).toBe(true)

		act(() => change(false))
		expect(result.current).toBe(false)
	})

	it('unsubscribes on unmount', () => {
		const { list, listeners } = installMatchMedia(false)

		const { unmount } = renderHook(() => useReducedMotion())
		expect(listeners.size).toBe(1)

		unmount()

		expect(list.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
		expect(listeners.size).toBe(0)
	})
})
