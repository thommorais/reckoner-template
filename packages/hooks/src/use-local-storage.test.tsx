import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage, useSessionStorage } from './use-local-storage'

beforeEach(() => {
	window.localStorage.clear()
	window.sessionStorage.clear()
})

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useLocalStorage', () => {
	it('returns the default value when storage is empty', () => {
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'fallback' }))

		expect(result.current[0]).toBe('fallback')
	})

	it('does not write the default value to storage', () => {
		renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'fallback' }))

		expect(window.localStorage.getItem('k')).toBeNull()
	})

	it('returns the stored value on the first render', () => {
		window.localStorage.setItem('k', JSON.stringify('stored'))
		const seen: string[] = []

		renderHook(() => {
			const [value] = useLocalStorage({ key: 'k', defaultValue: 'fallback' })
			seen.push(value)
		})

		expect(seen[0]).toBe('stored')
	})

	it('writes serialized values and updates the returned value', () => {
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 0 }))

		act(() => result.current[1](5))

		expect(result.current[0]).toBe(5)
		expect(window.localStorage.getItem('k')).toBe('5')
	})

	it('accepts a functional updater', () => {
		window.localStorage.setItem('k', '1')
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 0 }))

		act(() => result.current[1](prev => prev + 1))

		expect(result.current[0]).toBe(2)
		expect(window.localStorage.getItem('k')).toBe('2')
	})

	it('removes the stored value and returns to the default', () => {
		window.localStorage.setItem('k', JSON.stringify('stored'))
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'fallback' }))

		act(() => result.current[2]())

		expect(result.current[0]).toBe('fallback')
		expect(window.localStorage.getItem('k')).toBeNull()
	})

	it('keeps two hooks on the same key in sync within a tab', () => {
		const a = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))
		const b = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))

		act(() => a.result.current[1]('y'))

		expect(b.result.current[0]).toBe('y')
	})

	it('does not update hooks on other keys', () => {
		const a = renderHook(() => useLocalStorage({ key: 'a', defaultValue: 'x' }))
		const b = renderHook(() => useLocalStorage({ key: 'b', defaultValue: 'x' }))

		act(() => a.result.current[1]('y'))

		expect(b.result.current[0]).toBe('x')
	})

	it('picks up writes from another tab', () => {
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))

		act(() => {
			window.localStorage.setItem('k', JSON.stringify('remote'))
			window.dispatchEvent(
				new StorageEvent('storage', { key: 'k', newValue: JSON.stringify('remote'), storageArea: window.localStorage }),
			)
		})

		expect(result.current[0]).toBe('remote')
	})

	it('returns a stable reference for object values across renders', () => {
		window.localStorage.setItem('k', JSON.stringify({ a: 1 }))
		const { result, rerender } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: { a: 0 } }))
		const first = result.current[0]

		rerender()

		expect(result.current[0]).toBe(first)
	})

	it('reads the new key when the key changes', () => {
		window.localStorage.setItem('a', JSON.stringify('from-a'))
		window.localStorage.setItem('b', JSON.stringify('from-b'))
		const { result, rerender } = renderHook(({ k }) => useLocalStorage({ key: k, defaultValue: 'x' }), {
			initialProps: { k: 'a' },
		})

		rerender({ k: 'b' })

		expect(result.current[0]).toBe('from-b')
	})
})

describe('useLocalStorage failure handling', () => {
	it('falls back to the default when reading storage throws', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked')
		})

		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'fallback' }))

		expect(result.current[0]).toBe('fallback')
	})

	it('does not throw when writing storage throws', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('quota')
		})
		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))

		expect(() => act(() => result.current[1]('y'))).not.toThrow()
	})

	it('throws a named error when the value cannot be serialized', () => {
		const circular: Record<string, unknown> = {}
		circular.self = circular
		const { result } = renderHook(() => useLocalStorage<unknown>({ key: 'k', defaultValue: null }))

		expect(() => act(() => result.current[1](circular))).toThrow('use-local-storage: Failed to serialize the value')
	})

	it('returns the raw string when stored JSON is invalid', () => {
		window.localStorage.setItem('k', 'not json')

		const { result } = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))

		expect(result.current[0]).toBe('not json')
	})
})

describe('useSessionStorage', () => {
	it('writes to sessionStorage and leaves localStorage untouched', () => {
		const { result } = renderHook(() => useSessionStorage({ key: 'k', defaultValue: 'x' }))

		act(() => result.current[1]('y'))

		expect(window.sessionStorage.getItem('k')).toBe(JSON.stringify('y'))
		expect(window.localStorage.getItem('k')).toBeNull()
	})

	it('does not sync with a localStorage hook on the same key', () => {
		const local = renderHook(() => useLocalStorage({ key: 'k', defaultValue: 'x' }))
		const session = renderHook(() => useSessionStorage({ key: 'k', defaultValue: 'x' }))

		act(() => session.result.current[1]('y'))

		expect(local.result.current[0]).toBe('x')
	})
})
