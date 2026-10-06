import type { Realtime } from '../client'

export type Connection = {
	readonly onReconnect: (listener: () => void) => () => void
}

const noop = () => {}

export const createConnection = (realtime: Realtime): Connection => {
	const listeners = new Set<() => void>()
	let connected = false

	void realtime
		.subscribe('PB_CONNECT', () => {
			if (!connected) {
				connected = true
				return
			}

			for (const listener of listeners) listener()
		})
		.catch(noop)

	return {
		onReconnect: listener => {
			listeners.add(listener)

			return () => {
				listeners.delete(listener)
			}
		},
	}
}
