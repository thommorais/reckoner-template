import { describe, expect, it, vi } from 'vitest'
import { createConnection } from './connection'

const fakeRealtime = () => {
	const handlers: (() => void)[] = []

	return {
		subscribe: vi.fn(async (_topic: string, handler: () => void) => {
			handlers.push(handler)
		}),
		connect: () => {
			for (const handler of handlers) handler()
		},
	}
}

describe('a connection', () => {
	it('listens for the connect event', () => {
		const realtime = fakeRealtime()

		createConnection(realtime)

		expect(realtime.subscribe).toHaveBeenCalledExactlyOnceWith('PB_CONNECT', expect.any(Function))
	})

	it('stays quiet on the first connect', () => {
		const realtime = fakeRealtime()
		const listener = vi.fn()
		createConnection(realtime).onReconnect(listener)

		realtime.connect()

		expect(listener).not.toHaveBeenCalled()
	})

	it('tells listeners about every connect after the first', () => {
		const realtime = fakeRealtime()
		const listener = vi.fn()
		createConnection(realtime).onReconnect(listener)

		realtime.connect()
		realtime.connect()
		realtime.connect()

		expect(listener).toHaveBeenCalledTimes(2)
	})

	it('stops telling a listener that was removed', () => {
		const realtime = fakeRealtime()
		const listener = vi.fn()
		const remove = createConnection(realtime).onReconnect(listener)

		realtime.connect()
		remove()
		realtime.connect()

		expect(listener).not.toHaveBeenCalled()
	})

	it('handles a realtime service that refuses the subscription', () => {
		const refusal = Promise.reject<void>(new Error('offline'))
		const handled = vi.spyOn(refusal, 'catch')

		createConnection({ subscribe: () => refusal })

		expect(handled).toHaveBeenCalledOnce()
	})
})
