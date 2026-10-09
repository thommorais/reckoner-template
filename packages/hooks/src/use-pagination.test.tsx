import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DOTS, usePagination } from './use-pagination'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

const D = DOTS

type Row = {
	name: string
	total: number
	active: number
	siblings?: number
	boundaries?: number
	expected: (number | typeof DOTS)[]
}

const rows: Row[] = [
	{ name: 'total 0', total: 0, active: 1, expected: [] },
	{ name: 'negative total', total: -4, active: 1, expected: [] },
	{ name: 'total 1', total: 1, active: 1, expected: [1] },
	{ name: 'fractional total is truncated', total: 5.9, active: 1, expected: [1, 2, 3, 4, 5] },
	{ name: 'total smaller than the window', total: 5, active: 3, expected: [1, 2, 3, 4, 5] },
	{ name: 'total equal to the window', total: 7, active: 4, expected: [1, 2, 3, 4, 5, 6, 7] },
	{ name: 'default, active at start', total: 10, active: 1, expected: [1, 2, 3, 4, 5, D, 10] },
	{ name: 'default, active 4 still shows no left dots', total: 10, active: 4, expected: [1, 2, 3, 4, 5, D, 10] },
	{ name: 'default, active in the middle', total: 10, active: 5, expected: [1, D, 4, 5, 6, D, 10] },
	{ name: 'default, active 6', total: 10, active: 6, expected: [1, D, 5, 6, 7, D, 10] },
	{ name: 'default, active 7 shows no right dots', total: 10, active: 7, expected: [1, D, 6, 7, 8, 9, 10] },
	{ name: 'default, active at end', total: 10, active: 10, expected: [1, D, 6, 7, 8, 9, 10] },
	{ name: 'boundaries 0, active at start', total: 10, active: 1, boundaries: 0, expected: [1, 2, 3, 4, D] },
	{ name: 'boundaries 0, active in the middle', total: 10, active: 5, boundaries: 0, expected: [D, 4, 5, 6, D] },
	{ name: 'boundaries 0, active at end', total: 10, active: 10, boundaries: 0, expected: [D, 7, 8, 9, 10] },
	{
		name: 'boundaries 2, total equal to the window',
		total: 9,
		active: 5,
		boundaries: 2,
		expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
	},
	{
		name: 'boundaries 2, active at start',
		total: 12,
		active: 1,
		boundaries: 2,
		expected: [1, 2, 3, 4, 5, 6, D, 11, 12],
	},
	{
		name: 'boundaries 2, active in the middle',
		total: 12,
		active: 6,
		boundaries: 2,
		expected: [1, 2, D, 5, 6, 7, D, 11, 12],
	},
	{
		name: 'boundaries 2, active at end',
		total: 12,
		active: 12,
		boundaries: 2,
		expected: [1, 2, D, 7, 8, 9, 10, 11, 12],
	},
	{ name: 'siblings 0, active in the middle', total: 10, active: 5, siblings: 0, expected: [1, D, 5, D, 10] },
	{ name: 'siblings 2, active at start', total: 20, active: 1, siblings: 2, expected: [1, 2, 3, 4, 5, 6, 7, D, 20] },
	{
		name: 'siblings 2, active in the middle',
		total: 20,
		active: 10,
		siblings: 2,
		expected: [1, D, 8, 9, 10, 11, 12, D, 20],
	},
	{
		name: 'siblings 2, active at end',
		total: 20,
		active: 20,
		siblings: 2,
		expected: [1, D, 14, 15, 16, 17, 18, 19, 20],
	},
]

describe('DOTS', () => {
	it('is the ellipsis string', () => {
		expect(DOTS).toBe('...')
	})
})

describe('usePagination range', () => {
	it.each(rows)('$name', ({ total, active, siblings, boundaries, expected }) => {
		const { result } = renderHook(() => usePagination({ total, page: active, siblings, boundaries }))

		expect(result.current.range).toEqual(expected)
	})

	it('has a constant length of siblings * 2 + boundaries * 2 + 3 once truncated', () => {
		for (const active of [1, 3, 5, 8, 12, 15]) {
			const { result } = renderHook(() => usePagination({ total: 15, page: active }))

			expect(result.current.range).toHaveLength(7)
		}
	})

	it('returns a stable range reference while inputs are unchanged', () => {
		const { result, rerender } = renderHook(() => usePagination({ total: 10, page: 5 }))
		const first = result.current.range

		rerender()

		expect(result.current.range).toBe(first)
	})
})

describe('usePagination uncontrolled', () => {
	it('starts at page 1', () => {
		const { result } = renderHook(() => usePagination({ total: 10 }))

		expect(result.current.active).toBe(1)
	})

	it('starts at initialPage', () => {
		const { result } = renderHook(() => usePagination({ total: 10, initialPage: 5 }))

		expect(result.current.active).toBe(5)
		expect(result.current.range).toEqual([1, D, 4, 5, 6, D, 10])
	})

	it('moves to the page given to setPage and recomputes the range', () => {
		const { result } = renderHook(() => usePagination({ total: 10 }))

		act(() => result.current.setPage(10))

		expect(result.current.active).toBe(10)
		expect(result.current.range).toEqual([1, D, 6, 7, 8, 9, 10])
	})

	it('calls onChange with the new page', () => {
		const onChange = vi.fn()
		const { result } = renderHook(() => usePagination({ total: 10, onChange }))

		act(() => result.current.setPage(3))

		expect(onChange).toHaveBeenCalledTimes(1)
		expect(onChange).toHaveBeenCalledWith(3)
	})

	it('does not call onChange on mount', () => {
		const onChange = vi.fn()

		renderHook(() => usePagination({ total: 10, onChange }))

		expect(onChange).not.toHaveBeenCalled()
	})

	it('recomputes the range when total changes', () => {
		const { result, rerender } = renderHook(({ total }) => usePagination({ total }), { initialProps: { total: 5 } })

		expect(result.current.range).toEqual([1, 2, 3, 4, 5])

		rerender({ total: 10 })

		expect(result.current.range).toEqual([1, 2, 3, 4, 5, D, 10])
	})
})

describe('usePagination controlled', () => {
	it('uses page as the active page', () => {
		const { result } = renderHook(() => usePagination({ total: 10, page: 6, initialPage: 2 }))

		expect(result.current.active).toBe(6)
	})

	it('does not move on setPage but calls onChange', () => {
		const onChange = vi.fn()
		const { result } = renderHook(() => usePagination({ total: 10, page: 6, onChange }))

		act(() => result.current.setPage(7))

		expect(result.current.active).toBe(6)
		expect(onChange).toHaveBeenCalledWith(7)
	})

	it('follows page changes from the parent', () => {
		const { result, rerender } = renderHook(({ page }) => usePagination({ total: 10, page }), {
			initialProps: { page: 1 },
		})

		rerender({ page: 10 })

		expect(result.current.active).toBe(10)
		expect(result.current.range).toEqual([1, D, 6, 7, 8, 9, 10])
	})

	it('does not throw on setPage without onChange', () => {
		const { result } = renderHook(() => usePagination({ total: 10, page: 2 }))

		expect(() => act(() => result.current.setPage(3))).not.toThrow()
	})
})
