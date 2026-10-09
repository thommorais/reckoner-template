import { act, cleanup, renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { KeyBindingMap, KeyBindingOptions } from './lib/keybindings'
import { useKeybindings } from './use-keybindings'

type Props = {
	map: KeyBindingMap
	target?: Window | HTMLElement
	options?: KeyBindingOptions
}

const press = (target: EventTarget, init: KeyboardEventInit, type: 'keydown' | 'keyup' = 'keydown') =>
	act(() => {
		target.dispatchEvent(new KeyboardEvent(type, { bubbles: true, ...init }))
	})

const keyCalls = (spy: { mock: { calls: unknown[][] } }, type = 'keydown') =>
	spy.mock.calls.filter(call => call[0] === type)

const render = (initialProps: Props) =>
	renderHook(({ map, target, options }: Props) => useKeybindings(map, target, options), { initialProps })

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
	vi.useRealTimers()
})

describe('useKeybindings', () => {
	it('fires a binding on window by default', () => {
		const handler = vi.fn()
		render({ map: { a: handler } })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('passes the keyboard event to the handler', () => {
		const handler = vi.fn()
		render({ map: { a: handler } })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent)
	})

	it('fires a sequence binding', () => {
		const handler = vi.fn()
		render({ map: { 'g i': handler } })

		press(window, { key: 'g', code: 'KeyG' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('fires several bindings from one map', () => {
		const a = vi.fn()
		const b = vi.fn()
		render({ map: { a, b } })

		press(window, { key: 'b', code: 'KeyB' })

		expect(a).not.toHaveBeenCalled()
		expect(b).toHaveBeenCalledTimes(1)
	})

	it('subscribes once on mount', () => {
		const add = vi.spyOn(window, 'addEventListener')
		render({ map: { a: vi.fn() } })

		expect(keyCalls(add)).toHaveLength(1)
	})

	it('uses the latest handler after a rerender without re-subscribing', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = render({ map: { a: first } })

		rerender({ map: { a: second } })
		press(window, { key: 'a', code: 'KeyA' })

		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
		expect(keyCalls(add)).toHaveLength(1)
		expect(keyCalls(remove)).toHaveLength(0)
	})

	it('does not re-subscribe when the map object changes with the same keys', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const { rerender } = render({ map: { a: vi.fn(), b: vi.fn() } })

		rerender({ map: { a: vi.fn(), b: vi.fn() } })
		rerender({ map: { a: vi.fn(), b: vi.fn() } })

		expect(keyCalls(add)).toHaveLength(1)
		expect(keyCalls(remove)).toHaveLength(0)
	})

	it('keeps a partially entered sequence across a handler change', () => {
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = render({ map: { 'g i': first } })

		press(window, { key: 'g', code: 'KeyG' })
		rerender({ map: { 'g i': second } })
		press(window, { key: 'i', code: 'KeyI' })

		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('re-subscribes when a binding key is added', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const a = vi.fn()
		const b = vi.fn()
		const { rerender } = render({ map: { a } })

		rerender({ map: { a, b } })
		press(window, { key: 'b', code: 'KeyB' })

		expect(keyCalls(add)).toHaveLength(2)
		expect(keyCalls(remove)).toHaveLength(1)
		expect(b).toHaveBeenCalledTimes(1)
	})

	it('re-subscribes when a binding key is removed and stops firing it', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const a = vi.fn()
		const b = vi.fn()
		const { rerender } = render({ map: { a, b } })

		rerender({ map: { a } })
		press(window, { key: 'b', code: 'KeyB' })
		press(window, { key: 'a', code: 'KeyA' })

		expect(keyCalls(add)).toHaveLength(2)
		expect(keyCalls(remove)).toHaveLength(1)
		expect(b).not.toHaveBeenCalled()
		expect(a).toHaveBeenCalledTimes(1)
	})

	it('re-subscribes when a binding key is renamed', () => {
		const handler = vi.fn()
		const { rerender } = render({ map: { a: handler } })

		rerender({ map: { b: handler } })
		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'b', code: 'KeyB' })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('handles an empty map', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const { unmount } = render({ map: {} })

		press(window, { key: 'a', code: 'KeyA' })
		unmount()

		expect(keyCalls(add)).toHaveLength(1)
	})

	it('picks up bindings when an empty map becomes non-empty', () => {
		const handler = vi.fn()
		const { rerender } = render({ map: {} })

		rerender({ map: { a: handler } })
		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('attaches to the target element and not to window', () => {
		const element = document.createElement('input')
		document.body.append(element)
		const handler = vi.fn()
		render({ map: { a: handler }, target: element })

		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(element, { key: 'a', code: 'KeyA' })
		expect(handler).toHaveBeenCalledTimes(1)
		element.remove()
	})

	it('re-subscribes when the target changes', () => {
		const first = document.createElement('input')
		const second = document.createElement('input')
		document.body.append(first, second)
		const handler = vi.fn()
		const { rerender } = render({ map: { a: handler }, target: first })

		rerender({ map: { a: handler }, target: second })
		press(first, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(second, { key: 'a', code: 'KeyA' })
		expect(handler).toHaveBeenCalledTimes(1)
		first.remove()
		second.remove()
	})

	it('does not read window while rendering', () => {
		vi.stubGlobal('window', undefined)

		const Probe = () => {
			useKeybindings({ a: vi.fn() })

			return null
		}

		expect(() => renderToString(<Probe />)).not.toThrow()
	})

	it('does not subscribe until the effect runs', () => {
		const add = vi.spyOn(window, 'addEventListener')

		expect(keyCalls(add)).toHaveLength(0)

		render({ map: { a: vi.fn() } })

		expect(keyCalls(add)).toHaveLength(1)
	})

	it('unsubscribes on unmount', () => {
		const remove = vi.spyOn(window, 'removeEventListener')
		const handler = vi.fn()
		const { unmount } = render({ map: { a: handler } })

		unmount()
		press(window, { key: 'a', code: 'KeyA' })

		expect(keyCalls(remove)).toHaveLength(1)
		expect(handler).not.toHaveBeenCalled()
	})

	it('removes the same listener it added', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const { unmount } = render({ map: { a: vi.fn() } })

		unmount()

		expect(keyCalls(remove)[0]?.[1]).toBe(keyCalls(add)[0]?.[1])
	})

	it('unsubscribes from an element target on unmount', () => {
		const element = document.createElement('input')
		document.body.append(element)
		const handler = vi.fn()
		const { unmount } = render({ map: { a: handler }, target: element })

		unmount()
		press(element, { key: 'a', code: 'KeyA' })

		expect(handler).not.toHaveBeenCalled()
		element.remove()
	})

	it('passes the event option through', () => {
		const handler = vi.fn()
		render({ map: { a: handler }, options: { event: 'keyup' } })

		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'a', code: 'KeyA' }, 'keyup')
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('re-subscribes when the event option changes', () => {
		const handler = vi.fn()
		const map = { a: handler }
		const { rerender } = render({ map, options: { event: 'keydown' } })

		rerender({ map, options: { event: 'keyup' } })
		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'a', code: 'KeyA' }, 'keyup')
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('passes the capture option through', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')
		const { unmount } = render({ map: { a: vi.fn() }, options: { capture: true } })

		unmount()

		expect(keyCalls(add)[0]?.[2]).toBe(true)
		expect(keyCalls(remove)[0]?.[2]).toBe(true)
	})

	it('re-subscribes when the capture option changes', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const map = { a: vi.fn() }
		const { rerender } = render({ map, options: { capture: false } })

		rerender({ map, options: { capture: true } })

		expect(keyCalls(add)).toHaveLength(2)
		expect(keyCalls(add)[1]?.[2]).toBe(true)
	})

	it('does not re-subscribe when the options object is recreated with the same values', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const map = { a: vi.fn() }
		const { rerender } = render({ map, options: { event: 'keydown', capture: true, timeout: 300 } })

		rerender({ map, options: { event: 'keydown', capture: true, timeout: 300 } })

		expect(keyCalls(add)).toHaveLength(1)
	})

	it('passes the timeout option through', () => {
		vi.useFakeTimers()
		const handler = vi.fn()
		render({ map: { 'g i': handler }, options: { timeout: 200 } })

		press(window, { key: 'g', code: 'KeyG' })
		act(() => {
			vi.advanceTimersByTime(201)
		})
		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'g', code: 'KeyG' })
		act(() => {
			vi.advanceTimersByTime(150)
		})
		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('re-subscribes when the timeout option changes', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const map = { a: vi.fn() }
		const { rerender } = render({ map, options: { timeout: 100 } })

		rerender({ map, options: { timeout: 500 } })

		expect(keyCalls(add)).toHaveLength(2)
	})
})
