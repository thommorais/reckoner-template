import { cleanup, renderHook } from '@testing-library/react'
import { useEffect, useLayoutEffect } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useIsomorphicEffect } from './use-isomorphic-effect'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useIsomorphicEffect', () => {
	it('is useLayoutEffect when a document exists', () => {
		expect(useIsomorphicEffect).toBe(useLayoutEffect)
	})

	it('runs before passive effects regardless of declaration order', () => {
		const order: string[] = []

		renderHook(() => {
			useEffect(() => {
				order.push('passive')
			})
			useIsomorphicEffect(() => {
				order.push('isomorphic')
			})
		})

		expect(order).toEqual(['isomorphic', 'passive'])
	})

	it('runs on mount and runs cleanup on unmount', () => {
		const cleanupFn = vi.fn()
		const effect = vi.fn(() => cleanupFn)
		const { unmount } = renderHook(() => useIsomorphicEffect(effect, []))

		expect(effect).toHaveBeenCalledTimes(1)
		expect(cleanupFn).not.toHaveBeenCalled()

		unmount()

		expect(cleanupFn).toHaveBeenCalledTimes(1)
	})
})
