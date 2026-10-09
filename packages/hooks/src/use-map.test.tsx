import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useMap } from './use-map'

afterEach(() => {
	cleanup()
})

describe('useMap', () => {
	it('starts empty without initial entries', () => {
		const { result } = renderHook(() => useMap<string, number>())

		expect(result.current.size).toBe(0)
	})

	it('seeds from initial entries', () => {
		const { result } = renderHook(() =>
			useMap([
				['a', 1],
				['b', 2],
			]),
		)

		expect(result.current.size).toBe(2)
		expect(result.current.get('a')).toBe(1)
		expect(result.current.has('b')).toBe(true)
		expect(result.current.has('c')).toBe(false)
	})

	it('is an instance of Map', () => {
		const { result } = renderHook(() => useMap<string, number>())

		expect(result.current).toBeInstanceOf(Map)
	})

	it('adds an entry and re-renders', () => {
		const { result } = renderHook(() => useMap<string, number>())

		act(() => {
			result.current.set('a', 1)
		})

		expect(result.current.get('a')).toBe(1)
		expect(result.current.size).toBe(1)
	})

	it('overwrites an existing key', () => {
		const { result } = renderHook(() => useMap([['a', 1]] as [string, number][]))

		act(() => {
			result.current.set('a', 2)
		})

		expect(result.current.get('a')).toBe(2)
		expect(result.current.size).toBe(1)
	})

	it('persists several sets made in one batch', () => {
		const { result } = renderHook(() => useMap<string, number>())

		act(() => {
			result.current.set('a', 1)
			result.current.set('b', 2)
		})

		expect(result.current.get('a')).toBe(1)
		expect(result.current.get('b')).toBe(2)
	})

	it('persists chained sets', () => {
		const { result } = renderHook(() => useMap<string, number>())

		act(() => {
			result.current.set('a', 1).set('b', 2)
		})

		expect(result.current.get('a')).toBe(1)
		expect(result.current.get('b')).toBe(2)
	})

	it('deletes a present key and reports true', () => {
		const { result } = renderHook(() => useMap([['a', 1]] as [string, number][]))
		let deleted = false

		act(() => {
			deleted = result.current.delete('a')
		})

		expect(deleted).toBe(true)
		expect(result.current.has('a')).toBe(false)
		expect(result.current.size).toBe(0)
	})

	it('reports false when deleting an absent key', () => {
		const { result } = renderHook(() => useMap([['a', 1]] as [string, number][]))
		let deleted = true

		act(() => {
			deleted = result.current.delete('missing')
		})

		expect(deleted).toBe(false)
		expect(result.current.size).toBe(1)
	})

	it('clears every entry', () => {
		const { result } = renderHook(() =>
			useMap([
				['a', 1],
				['b', 2],
			] as [string, number][]),
		)

		act(() => {
			result.current.clear()
		})

		expect(result.current.size).toBe(0)
	})

	it('iterates entries, keys and values', () => {
		const { result } = renderHook(() =>
			useMap([
				['a', 1],
				['b', 2],
			] as [string, number][]),
		)

		expect([...result.current]).toEqual([
			['a', 1],
			['b', 2],
		])
		expect([...result.current.keys()]).toEqual(['a', 'b'])
		expect([...result.current.values()]).toEqual([1, 2])
	})

	it('calls forEach with value, key and the map', () => {
		const { result } = renderHook(() => useMap([['a', 1]] as [string, number][]))
		const seen: [number, string][] = []

		// oxlint-disable-next-line unicorn/no-array-for-each -- Map#forEach is the API under test
		result.current.forEach((value, key) => seen.push([value, key]))

		expect(seen).toEqual([[1, 'a']])
	})

	it('keeps its contents across a re-render with no mutation', () => {
		const { result, rerender } = renderHook(() => useMap([['a', 1]] as [string, number][]))

		rerender()

		expect(result.current.get('a')).toBe(1)
	})

	it('ignores a changed initial state after the first render', () => {
		const { result, rerender } = renderHook(({ entries }) => useMap(entries), {
			initialProps: { entries: [['a', 1]] as [string, number][] },
		})

		rerender({ entries: [['b', 2]] })

		expect(result.current.has('a')).toBe(true)
		expect(result.current.has('b')).toBe(false)
	})

	it('returns a new reference after a mutation so dependents update', () => {
		const { result } = renderHook(() => useMap<string, number>())
		const before = result.current

		act(() => {
			result.current.set('a', 1)
		})

		expect(result.current).not.toBe(before)
	})

	it('does not change what an earlier reference shows after a mutation', () => {
		const { result } = renderHook(() => useMap<string, number>())
		const before = result.current

		act(() => {
			result.current.set('a', 1)
		})

		expect(before.size).toBe(0)
	})

	it('does not mutate the initial entries array', () => {
		const entries: [string, number][] = [['a', 1]]
		const { result } = renderHook(() => useMap(entries))

		act(() => {
			result.current.set('b', 2)
		})

		expect(entries).toEqual([['a', 1]])
	})
})
