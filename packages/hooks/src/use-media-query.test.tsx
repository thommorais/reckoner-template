import { act, cleanup, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { breakpoints, useBreakpoint, useMediaQuery } from './use-media-query'

type FakeList = {
	matches: boolean
	addEventListener: ReturnType<typeof vi.fn>
	removeEventListener: ReturnType<typeof vi.fn>
	listeners: Set<() => void>
}

const installMatchMedia = (initial: Record<string, boolean> = {}) => {
	const lists = new Map<string, FakeList>()
	const matchMedia = vi.fn((query: string) => {
		const existing = lists.get(query)

		if (existing) {
			return existing
		}

		const listeners = new Set<() => void>()
		const list: FakeList = {
			matches: initial[query] ?? false,
			listeners,
			addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
			removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
		}
		lists.set(query, list)
		return list
	})

	vi.stubGlobal('matchMedia', matchMedia)

	const change = (query: string, matches: boolean) => {
		const list = lists.get(query)

		if (!list) {
			throw new Error(`no list for ${query}`)
		}

		list.matches = matches
		for (const listener of list.listeners) {
			listener()
		}
	}

	return { lists, matchMedia, change }
}

afterEach(() => {
	cleanup()
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('useMediaQuery', () => {
	it('returns the initial match', () => {
		installMatchMedia({ '(min-width: 10px)': true })

		const { result } = renderHook(() => useMediaQuery('(min-width: 10px)'))

		expect(result.current).toBe(true)
	})

	it('returns false when the query does not match', () => {
		installMatchMedia()

		const { result } = renderHook(() => useMediaQuery('(min-width: 10px)'))

		expect(result.current).toBe(false)
	})

	it('updates when the media query changes', () => {
		const { change } = installMatchMedia()

		const { result } = renderHook(() => useMediaQuery('(min-width: 10px)'))

		act(() => change('(min-width: 10px)', true))
		expect(result.current).toBe(true)

		act(() => change('(min-width: 10px)', false))
		expect(result.current).toBe(false)
	})

	it('subscribes to change events', () => {
		const { lists } = installMatchMedia()

		renderHook(() => useMediaQuery('(min-width: 10px)'))

		expect(lists.get('(min-width: 10px)')?.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
	})

	it('removes the same listener on unmount', () => {
		const { lists } = installMatchMedia()

		const { unmount } = renderHook(() => useMediaQuery('(min-width: 10px)'))
		const list = lists.get('(min-width: 10px)')
		const added = list?.addEventListener.mock.calls[0]?.[1]

		unmount()

		expect(list?.removeEventListener).toHaveBeenCalledWith('change', added)
		expect(list?.listeners.size).toBe(0)
	})

	it('resubscribes when the query changes', () => {
		const { lists } = installMatchMedia({ '(min-width: 20px)': true })

		const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
			initialProps: { query: '(min-width: 10px)' },
		})

		expect(result.current).toBe(false)

		rerender({ query: '(min-width: 20px)' })

		expect(result.current).toBe(true)
		expect(lists.get('(min-width: 10px)')?.listeners.size).toBe(0)
		expect(lists.get('(min-width: 20px)')?.listeners.size).toBe(1)
	})

	it('does not update after unmount', () => {
		const { change } = installMatchMedia()

		const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 10px)'))
		unmount()
		change('(min-width: 10px)', true)

		expect(result.current).toBe(false)
	})

	it('throws from the server snapshot', () => {
		installMatchMedia()

		const Probe = () => createElement('span', null, String(useMediaQuery('(min-width: 10px)')))
		vi.spyOn(console, 'error').mockImplementation(() => {})

		expect(() => renderToString(createElement(Probe))).toThrow('useMediaQuery is a client-only hook')
	})
})

describe('useBreakpoint', () => {
	it.each(Object.keys(breakpoints) as (keyof typeof breakpoints)[])('queries the %s breakpoint', name => {
		const { matchMedia } = installMatchMedia()

		renderHook(() => useBreakpoint(name))

		expect(matchMedia).toHaveBeenCalledWith(breakpoints[name])
	})

	it('reflects the breakpoint match', () => {
		installMatchMedia({ [breakpoints.md]: true })

		const { result } = renderHook(() => useBreakpoint('md'))

		expect(result.current).toBe(true)
	})

	it('updates when the breakpoint query changes', () => {
		const { change } = installMatchMedia()

		const { result } = renderHook(() => useBreakpoint('lg'))

		act(() => change(breakpoints.lg, true))

		expect(result.current).toBe(true)
	})
})
