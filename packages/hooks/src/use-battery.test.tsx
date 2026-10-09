import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useBattery } from './use-battery'

const EVENTS = ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']

type FakeBattery = EventTarget & {
	level: number
	charging: boolean
	chargingTime: number
	dischargingTime: number
}

const makeBattery = (fields: Partial<Omit<FakeBattery, keyof EventTarget>> = {}) => {
	const battery = new EventTarget() as FakeBattery
	battery.level = fields.level ?? 0.5
	battery.charging = fields.charging ?? false
	battery.chargingTime = fields.chargingTime ?? Infinity
	battery.dischargingTime = fields.dischargingTime ?? 3600
	return battery
}

const installGetBattery = (impl: () => Promise<unknown>) => {
	const getBattery = vi.fn(impl)
	Object.defineProperty(navigator, 'getBattery', { configurable: true, value: getBattery })
	return getBattery
}

afterEach(() => {
	cleanup()
	Reflect.deleteProperty(navigator, 'getBattery')
	vi.restoreAllMocks()
})

describe('useBattery', () => {
	it('is unsupported without getBattery', () => {
		const { result } = renderHook(() => useBattery())

		expect(result.current).toEqual({
			supported: false,
			loading: false,
			level: null,
			charging: null,
			chargingTime: null,
			dischargingTime: null,
		})
	})

	it('starts loading while getBattery is pending', () => {
		installGetBattery(() => new Promise(() => {}))

		const { result } = renderHook(() => useBattery())

		expect(result.current).toEqual({
			supported: true,
			loading: true,
			level: null,
			charging: null,
			chargingTime: null,
			dischargingTime: null,
		})
	})

	it('reads the battery once resolved', async () => {
		const battery = makeBattery({ level: 0.8, charging: true, chargingTime: 120, dischargingTime: Infinity })
		installGetBattery(() => Promise.resolve(battery))

		const { result } = renderHook(() => useBattery())

		await waitFor(() => expect(result.current.loading).toBe(false))

		expect(result.current).toEqual({
			supported: true,
			loading: false,
			level: 0.8,
			charging: true,
			chargingTime: 120,
			dischargingTime: Infinity,
		})
	})

	it('is unsupported when getBattery rejects', async () => {
		installGetBattery(() => Promise.reject(new Error('denied')))

		const { result } = renderHook(() => useBattery())

		await waitFor(() => expect(result.current.supported).toBe(false))

		expect(result.current.loading).toBe(false)
		expect(result.current.level).toBeNull()
	})

	it('is unsupported when getBattery throws synchronously', async () => {
		installGetBattery(() => {
			throw new Error('boom')
		})

		const { result } = renderHook(() => useBattery())

		await waitFor(() => expect(result.current.supported).toBe(false))
	})

	it.each(EVENTS)('updates on %s', async eventName => {
		const battery = makeBattery({ level: 0.5, charging: false })
		installGetBattery(() => Promise.resolve(battery))

		const { result } = renderHook(() => useBattery())
		await waitFor(() => expect(result.current.loading).toBe(false))

		act(() => {
			battery.level = 0.25
			battery.charging = true
			battery.chargingTime = 60
			battery.dischargingTime = 10
			battery.dispatchEvent(new Event(eventName))
		})

		expect(result.current.level).toBe(0.25)
		expect(result.current.charging).toBe(true)
		expect(result.current.chargingTime).toBe(60)
		expect(result.current.dischargingTime).toBe(10)
	})

	it('removes battery listeners on unmount', async () => {
		const battery = makeBattery()
		const addSpy = vi.spyOn(battery, 'addEventListener')
		const removeSpy = vi.spyOn(battery, 'removeEventListener')
		installGetBattery(() => Promise.resolve(battery))

		const { result, unmount } = renderHook(() => useBattery())
		await waitFor(() => expect(result.current.loading).toBe(false))

		expect(addSpy).toHaveBeenCalledTimes(EVENTS.length)

		unmount()

		expect(removeSpy).toHaveBeenCalledTimes(EVENTS.length)
		for (const eventName of EVENTS) {
			expect(removeSpy).toHaveBeenCalledWith(eventName, expect.any(Function))
		}
	})

	it('does not attach listeners when unmounted before resolve', async () => {
		const battery = makeBattery()
		const addSpy = vi.spyOn(battery, 'addEventListener')
		let resolve: (value: FakeBattery) => void = () => {}
		installGetBattery(
			() =>
				new Promise(res => {
					resolve = res
				}),
		)

		const { unmount } = renderHook(() => useBattery())
		unmount()

		await act(async () => {
			resolve(battery)
			await Promise.resolve()
		})

		expect(addSpy).not.toHaveBeenCalled()
	})

	it('does not set unsupported state when rejected after unmount', async () => {
		let reject: (reason: Error) => void = () => {}
		installGetBattery(
			() =>
				new Promise((_, rej) => {
					reject = rej
				}),
		)
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const { result, unmount } = renderHook(() => useBattery())
		unmount()

		await act(async () => {
			reject(new Error('late'))
			await Promise.resolve()
		})

		expect(result.current.loading).toBe(true)
		expect(errorSpy).not.toHaveBeenCalled()
	})

	it('calls getBattery once', async () => {
		const battery = makeBattery()
		const getBattery = installGetBattery(() => Promise.resolve(battery))

		const { result, rerender } = renderHook(() => useBattery())
		await waitFor(() => expect(result.current.loading).toBe(false))
		rerender()

		expect(getBattery).toHaveBeenCalledTimes(1)
	})

	it('renders as supported and loading on the server', () => {
		const Probe = () => {
			const { supported, loading } = useBattery()
			return createElement('span', null, `${supported}-${loading}`)
		}

		expect(renderToString(createElement(Probe))).toContain('true-true')
	})
})
