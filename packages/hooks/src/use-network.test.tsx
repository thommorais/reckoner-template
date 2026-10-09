import { act, cleanup, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNetwork } from './use-network'

type FakeConnection = {
	downlink?: number
	downlinkMax?: number
	effectiveType?: string
	rtt?: number
	saveData?: boolean
	type?: string
	addEventListener: ReturnType<typeof vi.fn>
	removeEventListener: ReturnType<typeof vi.fn>
	listeners: Set<() => void>
}

const setNavigatorProp = (key: string, value: unknown) => {
	Object.defineProperty(navigator, key, { configurable: true, value })
}

const setOnline = (value: boolean) => setNavigatorProp('onLine', value)

const makeConnection = (fields: Partial<FakeConnection> = {}): FakeConnection => {
	const listeners = new Set<() => void>()

	return {
		...fields,
		listeners,
		addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
		removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
	}
}

const fire = (connection: FakeConnection) => {
	for (const listener of connection.listeners) {
		listener()
	}
}

afterEach(() => {
	cleanup()
	for (const key of ['connection', 'mozConnection', 'webkitConnection', 'onLine']) {
		Reflect.deleteProperty(navigator, key)
	}
	vi.restoreAllMocks()
})

describe('useNetwork', () => {
	it('reports online without a connection api', () => {
		setOnline(true)

		const { result } = renderHook(() => useNetwork())

		expect(result.current.online).toBe(true)
		expect(result.current.effectiveType).toBeUndefined()
		expect(result.current.downlink).toBeUndefined()
		expect(result.current.rtt).toBeUndefined()
		expect(result.current.saveData).toBeUndefined()
		expect(result.current.type).toBeUndefined()
	})

	it('reports offline from navigator.onLine', () => {
		setOnline(false)

		const { result } = renderHook(() => useNetwork())

		expect(result.current.online).toBe(false)
	})

	it('reads connection fields', () => {
		setOnline(true)
		setNavigatorProp(
			'connection',
			makeConnection({ downlink: 10, downlinkMax: 100, effectiveType: '4g', rtt: 50, saveData: true, type: 'wifi' }),
		)

		const { result } = renderHook(() => useNetwork())

		expect(result.current).toEqual({
			online: true,
			downlink: 10,
			downlinkMax: 100,
			effectiveType: '4g',
			rtt: 50,
			saveData: true,
			type: 'wifi',
		})
	})

	it('falls back to mozConnection', () => {
		setOnline(true)
		setNavigatorProp('mozConnection', makeConnection({ effectiveType: '3g' }))

		const { result } = renderHook(() => useNetwork())

		expect(result.current.effectiveType).toBe('3g')
	})

	it('falls back to webkitConnection', () => {
		setOnline(true)
		setNavigatorProp('webkitConnection', makeConnection({ effectiveType: '2g' }))

		const { result } = renderHook(() => useNetwork())

		expect(result.current.effectiveType).toBe('2g')
	})

	it('prefers connection over vendor prefixed ones', () => {
		setOnline(true)
		setNavigatorProp('connection', makeConnection({ effectiveType: '4g' }))
		setNavigatorProp('mozConnection', makeConnection({ effectiveType: '3g' }))

		const { result } = renderHook(() => useNetwork())

		expect(result.current.effectiveType).toBe('4g')
	})

	it('updates on the offline and online window events', () => {
		setOnline(true)

		const { result } = renderHook(() => useNetwork())

		act(() => {
			setOnline(false)
			window.dispatchEvent(new Event('offline'))
		})
		expect(result.current.online).toBe(false)

		act(() => {
			setOnline(true)
			window.dispatchEvent(new Event('online'))
		})
		expect(result.current.online).toBe(true)
	})

	it('updates on connection change', () => {
		setOnline(true)
		const connection = makeConnection({ effectiveType: '4g', downlink: 10 })
		setNavigatorProp('connection', connection)

		const { result } = renderHook(() => useNetwork())

		act(() => {
			connection.effectiveType = '2g'
			connection.downlink = 0.5
			fire(connection)
		})

		expect(result.current.effectiveType).toBe('2g')
		expect(result.current.downlink).toBe(0.5)
	})

	it('keeps the same object reference when nothing changed', () => {
		setOnline(true)
		const connection = makeConnection({ effectiveType: '4g' })
		setNavigatorProp('connection', connection)

		const { result, rerender } = renderHook(() => useNetwork())
		const first = result.current

		rerender()
		act(() => fire(connection))

		expect(result.current).toBe(first)
	})

	it('returns a new reference when the state changes', () => {
		setOnline(true)

		const { result } = renderHook(() => useNetwork())
		const first = result.current

		act(() => {
			setOnline(false)
			window.dispatchEvent(new Event('offline'))
		})

		expect(result.current).not.toBe(first)
	})

	it('unsubscribes from window and connection on unmount', () => {
		setOnline(true)
		const connection = makeConnection({ effectiveType: '4g' })
		setNavigatorProp('connection', connection)
		const removeSpy = vi.spyOn(window, 'removeEventListener')

		const { unmount } = renderHook(() => useNetwork())
		expect(connection.listeners.size).toBe(1)

		unmount()

		expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function))
		expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function))
		expect(connection.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
		expect(connection.listeners.size).toBe(0)
	})

	it('does not update after unmount', () => {
		setOnline(true)

		const { result, unmount } = renderHook(() => useNetwork())
		unmount()
		setOnline(false)
		window.dispatchEvent(new Event('offline'))

		expect(result.current.online).toBe(true)
	})

	it('renders online on the server', () => {
		setOnline(false)

		const Probe = () => createElement('span', null, String(useNetwork().online))

		expect(renderToString(createElement(Probe))).toContain('true')
	})
})
