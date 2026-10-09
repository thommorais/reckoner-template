import { useMemo, useSyncExternalStore } from 'react'

type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g'
type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown'

type NetworkStatus = {
	downlink?: number
	downlinkMax?: number
	effectiveType?: EffectiveType
	rtt?: number
	saveData?: boolean
	type?: ConnectionType
}

type NetworkConnection = NetworkStatus & {
	addEventListener: (type: string, listener: EventListener) => void
	removeEventListener: (type: string, listener: EventListener) => void
}

type NavigatorWithConnection = Navigator & {
	connection?: NetworkConnection
	mozConnection?: NetworkConnection
	webkitConnection?: NetworkConnection
}

type NetworkState = NetworkStatus & {
	online: boolean
}

const getConnection = (): NetworkConnection | undefined => {
	if (typeof navigator === 'undefined') {
		return undefined
	}

	const nav = navigator as NavigatorWithConnection
	return nav.connection ?? nav.mozConnection ?? nav.webkitConnection
}

const readNetworkState = (): NetworkState => {
	const connection = getConnection()

	return {
		online: typeof navigator !== 'undefined' ? navigator.onLine : true,
		downlink: connection?.downlink,
		downlinkMax: connection?.downlinkMax,
		effectiveType: connection?.effectiveType,
		rtt: connection?.rtt,
		saveData: connection?.saveData,
		type: connection?.type,
	}
}

const subscribe = (callback: () => void) => {
	const connection = getConnection()

	window.addEventListener('online', callback)
	window.addEventListener('offline', callback)
	connection?.addEventListener('change', callback)

	return () => {
		window.removeEventListener('online', callback)
		window.removeEventListener('offline', callback)
		connection?.removeEventListener('change', callback)
	}
}

const getSnapshot = () => JSON.stringify(readNetworkState())

const getServerSnapshot = () => JSON.stringify({ online: true } satisfies NetworkState)

const useNetwork = (): NetworkState => {
	const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	return useMemo(() => JSON.parse(snapshot) as NetworkState, [snapshot])
}

export { useNetwork }
