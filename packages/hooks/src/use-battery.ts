import { tryCatch } from '@thom/try-catch'
import { useEffect, useState, useSyncExternalStore } from 'react'

type BatteryManager = EventTarget & {
	level: number
	charging: boolean
	chargingTime: number
	dischargingTime: number
}

type NavigatorWithBattery = Navigator & {
	getBattery?: () => Promise<BatteryManager>
}

type BatteryState = {
	supported: boolean
	loading: boolean
	level: number | null
	charging: boolean | null
	chargingTime: number | null
	dischargingTime: number | null
}

const BATTERY_EVENTS = ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange'] as const

const INITIAL_STATE: BatteryState = {
	supported: true,
	loading: true,
	level: null,
	charging: null,
	chargingTime: null,
	dischargingTime: null,
}

const UNSUPPORTED_STATE: BatteryState = { ...INITIAL_STATE, supported: false, loading: false }

const readBattery = (battery: BatteryManager): BatteryState => ({
	supported: true,
	loading: false,
	level: battery.level,
	charging: battery.charging,
	chargingTime: battery.chargingTime,
	dischargingTime: battery.dischargingTime,
})

const subscribeNever = () => () => {}

const hasBatteryApi = () => 'getBattery' in navigator

const useBattery = (): BatteryState => {
	const supported = useSyncExternalStore(subscribeNever, hasBatteryApi, () => true)
	const [state, setState] = useState(INITIAL_STATE)

	useEffect(() => {
		const nav = navigator as NavigatorWithBattery

		if (!nav.getBattery) {
			return
		}

		const getBattery = nav.getBattery.bind(nav)
		let cancelled = false
		let detach = () => {}

		void tryCatch(new Promise<BatteryManager>(resolve => resolve(getBattery()))).then(result => {
			if (cancelled) {
				return
			}

			if (!result.success) {
				setState(UNSUPPORTED_STATE)
				return
			}

			const battery = result.data
			const update = () => setState(readBattery(battery))

			update()
			for (const event of BATTERY_EVENTS) {
				battery.addEventListener(event, update)
			}
			detach = () => {
				for (const event of BATTERY_EVENTS) {
					battery.removeEventListener(event, update)
				}
			}
		})

		return () => {
			cancelled = true
			detach()
		}
	}, [])

	return supported ? state : UNSUPPORTED_STATE
}

export { useBattery }

export type { BatteryState }
