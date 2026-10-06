import type { Realtime } from '../client'

type Connection = {
	readonly onReconnect: (listener: () => void) => () => void
}

const noop = () => {}

const createConnection = (realtime: Realtime): Connection => {
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

export { createConnection }
export type { Connection }
