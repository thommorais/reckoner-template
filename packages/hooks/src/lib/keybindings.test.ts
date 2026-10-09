import { afterEach, describe, expect, it, vi } from 'vitest'
import { keybindings } from './keybindings'

type Init = KeyboardEventInit

const unsubscribers: Array<() => void> = []

const bind = (...args: Parameters<typeof keybindings>) => {
	const unsubscribe = keybindings(...args)
	unsubscribers.push(unsubscribe)

	return unsubscribe
}

const press = (target: EventTarget, init: Init, type: 'keydown' | 'keyup' = 'keydown') =>
	target.dispatchEvent(new KeyboardEvent(type, { bubbles: true, ...init }))

const loadKeybindings = async (platform: string) => {
	vi.resetModules()
	vi.stubGlobal('navigator', { platform })
	const module = await import('./keybindings')

	return module.keybindings
}

afterEach(() => {
	for (const unsubscribe of unsubscribers.splice(0)) {
		unsubscribe()
	}

	vi.useRealTimers()
	vi.unstubAllGlobals()
})

describe('keybindings', () => {
	it('fires on a single key', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('passes the keyboard event to the handler', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent)
		expect(handler.mock.calls[0]?.[0].key).toBe('a')
	})

	it('ignores a different key', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'b', code: 'KeyB' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('matches the key case-insensitively', () => {
		const handler = vi.fn()
		bind(window, { A: handler })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches the uppercase event key against a lowercase binding', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'A', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches on event.code', () => {
		const handler = vi.fn()
		bind(window, { KeyA: handler })

		press(window, { key: 'å', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches named keys', () => {
		const handler = vi.fn()
		bind(window, { Escape: handler })

		press(window, { key: 'Escape', code: 'Escape' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('resolves $mod to Control on non-Apple platforms', async () => {
		const bindNonApple = await loadKeybindings('Linux x86_64')
		const handler = vi.fn()
		unsubscribers.push(bindNonApple(window, { '$mod+k': handler }))

		press(window, { key: 'k', code: 'KeyK', metaKey: true })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'k', code: 'KeyK', ctrlKey: true })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('resolves $mod to Meta on Apple platforms', async () => {
		const bindApple = await loadKeybindings('MacIntel')
		const handler = vi.fn()
		unsubscribers.push(bindApple(window, { '$mod+k': handler }))

		press(window, { key: 'k', code: 'KeyK', ctrlKey: true })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'k', code: 'KeyK', metaKey: true })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches Shift+a only with shift held', () => {
		const handler = vi.fn()
		bind(window, { 'Shift+a': handler })

		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'A', code: 'KeyA', shiftKey: true })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches Control+Shift+x with both modifiers held', () => {
		const handler = vi.fn()
		bind(window, { 'Control+Shift+x': handler })

		press(window, { key: 'x', code: 'KeyX', ctrlKey: true })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'X', code: 'KeyX', ctrlKey: true, shiftKey: true })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches Alt+a with alt held', () => {
		const handler = vi.fn()
		bind(window, { 'Alt+a': handler })

		press(window, { key: 'a', code: 'KeyA', altKey: true })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('does not match a plain key when a modifier is also held', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'a', code: 'KeyA', ctrlKey: true })
		press(window, { key: 'a', code: 'KeyA', metaKey: true })
		press(window, { key: 'a', code: 'KeyA', altKey: true })
		press(window, { key: 'a', code: 'KeyA', shiftKey: true })

		expect(handler).not.toHaveBeenCalled()
	})

	it('does not match when an extra modifier is held beyond the required ones', () => {
		const handler = vi.fn()
		bind(window, { 'Control+k': handler })

		press(window, { key: 'k', code: 'KeyK', ctrlKey: true, shiftKey: true })
		press(window, { key: 'k', code: 'KeyK', ctrlKey: true, altKey: true })

		expect(handler).not.toHaveBeenCalled()
	})

	it('fires a sequence only after both presses', () => {
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('does not fire a sequence on the second key alone', () => {
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('fires a sequence again after completing it', () => {
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		press(window, { key: 'i', code: 'KeyI' })
		press(window, { key: 'g', code: 'KeyG' })
		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('resets a sequence when a wrong key comes in between', () => {
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		press(window, { key: 'x', code: 'KeyX' })
		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('does not reset a sequence when only a modifier key is pressed in between', () => {
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		press(window, { key: 'Shift', code: 'ShiftLeft', shiftKey: true })
		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('drops a sequence after the default 1000ms timeout', () => {
		vi.useFakeTimers()
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		vi.advanceTimersByTime(1001)
		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('keeps a sequence alive within the default timeout', () => {
		vi.useFakeTimers()
		const handler = vi.fn()
		bind(window, { 'g i': handler })

		press(window, { key: 'g', code: 'KeyG' })
		vi.advanceTimersByTime(900)
		press(window, { key: 'i', code: 'KeyI' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('honors a custom timeout', () => {
		vi.useFakeTimers()
		const handler = vi.fn()
		bind(window, { 'g i': handler }, { timeout: 200 })

		press(window, { key: 'g', code: 'KeyG' })
		vi.advanceTimersByTime(201)
		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'g', code: 'KeyG' })
		vi.advanceTimersByTime(150)
		press(window, { key: 'i', code: 'KeyI' })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('restarts the timeout on every key press', () => {
		vi.useFakeTimers()
		const handler = vi.fn()
		bind(window, { 'a b c': handler }, { timeout: 500 })

		press(window, { key: 'a', code: 'KeyA' })
		vi.advanceTimersByTime(400)
		press(window, { key: 'b', code: 'KeyB' })
		vi.advanceTimersByTime(400)
		press(window, { key: 'c', code: 'KeyC' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches a RegExp key against event.key', () => {
		const handler = vi.fn()
		bind(window, { '(\\d)': handler })

		press(window, { key: '5', code: 'Digit5' })
		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('matches a RegExp key against event.code', () => {
		const handler = vi.fn()
		bind(window, { '(Digit\\d)': handler })

		press(window, { key: '%', code: 'Digit5' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('anchors a RegExp key to the whole key', () => {
		const handler = vi.fn()
		bind(window, { '(\\d)': handler })

		press(window, { key: '55', code: 'Unidentified' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('combines a modifier with a RegExp key', () => {
		const handler = vi.fn()
		bind(window, { 'Control+(\\d)': handler })

		press(window, { key: '3', code: 'Digit3' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: '3', code: 'Digit3', ctrlKey: true })
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('listens to keydown by default and ignores keyup', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		press(window, { key: 'a', code: 'KeyA' }, 'keyup')

		expect(handler).not.toHaveBeenCalled()
	})

	it('listens to keyup when the event option is keyup', () => {
		const handler = vi.fn()
		bind(window, { a: handler }, { event: 'keyup' })

		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(window, { key: 'a', code: 'KeyA' }, 'keyup')
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('passes the capture option to addEventListener and removeEventListener', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')

		const unsubscribe = bind(window, { a: vi.fn() }, { capture: true })
		unsubscribe()

		expect(add).toHaveBeenCalledWith('keydown', expect.any(Function), true)
		expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function), true)
		add.mockRestore()
		remove.mockRestore()
	})

	it('runs a capturing listener before a bubbling listener on a descendant', () => {
		const parent = document.createElement('div')
		const child = document.createElement('button')
		parent.append(child)
		document.body.append(parent)
		const order: string[] = []
		child.addEventListener('keydown', () => order.push('child'))
		bind(parent, { a: () => order.push('capture') }, { capture: true })

		press(child, { key: 'a', code: 'KeyA' })
		parent.remove()

		expect(order).toEqual(['capture', 'child'])
	})

	it('ignores non-bubbling descendant events without capture', () => {
		const parent = document.createElement('div')
		const child = document.createElement('button')
		parent.append(child)
		document.body.append(parent)
		const handler = vi.fn()
		bind(parent, { a: handler })

		child.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: false }))
		parent.remove()

		expect(handler).not.toHaveBeenCalled()
	})

	it('attaches to an element target and not to window', () => {
		const element = document.createElement('input')
		document.body.append(element)
		const handler = vi.fn()
		bind(element, { a: handler })

		press(window, { key: 'a', code: 'KeyA' })
		expect(handler).not.toHaveBeenCalled()

		press(element, { key: 'a', code: 'KeyA' })
		expect(handler).toHaveBeenCalledTimes(1)
		element.remove()
	})

	it('removes the listener on unsubscribe', () => {
		const handler = vi.fn()
		const unsubscribe = bind(window, { a: handler })

		unsubscribe()
		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).not.toHaveBeenCalled()
	})

	it('removes the same listener it added', () => {
		const add = vi.spyOn(window, 'addEventListener')
		const remove = vi.spyOn(window, 'removeEventListener')

		const unsubscribe = bind(window, { a: vi.fn() })
		unsubscribe()

		const added = add.mock.calls.find(call => call[0] === 'keydown')?.[1]
		const removed = remove.mock.calls.find(call => call[0] === 'keydown')?.[1]
		add.mockRestore()
		remove.mockRestore()

		expect(added).toBeDefined()
		expect(removed).toBe(added)
	})

	it('ignores events that are not KeyboardEvents', () => {
		const handler = vi.fn()
		bind(window, { a: handler })

		window.dispatchEvent(new Event('keydown'))
		window.dispatchEvent(new CustomEvent('keydown', { detail: { key: 'a' } }))

		expect(handler).not.toHaveBeenCalled()
	})

	it('fires the matching binding among several in one map', () => {
		const a = vi.fn()
		const b = vi.fn()
		const c = vi.fn()
		bind(window, { a, b, 'Control+c': c })

		press(window, { key: 'b', code: 'KeyB' })
		expect(a).not.toHaveBeenCalled()
		expect(b).toHaveBeenCalledTimes(1)
		expect(c).not.toHaveBeenCalled()

		press(window, { key: 'c', code: 'KeyC', ctrlKey: true })
		expect(c).toHaveBeenCalledTimes(1)
	})

	it('fires every binding that matches the same press', () => {
		const first = vi.fn()
		const second = vi.fn()
		bind(window, { a: first, KeyA: second })

		press(window, { key: 'a', code: 'KeyA' })

		expect(first).toHaveBeenCalledTimes(1)
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('tracks sequences independently across bindings', () => {
		const gi = vi.fn()
		const gh = vi.fn()
		bind(window, { 'g i': gi, 'g h': gh })

		press(window, { key: 'g', code: 'KeyG' })
		press(window, { key: 'h', code: 'KeyH' })

		expect(gi).not.toHaveBeenCalled()
		expect(gh).toHaveBeenCalledTimes(1)
	})

	it('trims surrounding whitespace in a binding', () => {
		const handler = vi.fn()
		bind(window, { ' a ': handler })

		press(window, { key: 'a', code: 'KeyA' })

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('supports a $mod sequence step', async () => {
		const bindNonApple = await loadKeybindings('Linux x86_64')
		const handler = vi.fn()
		unsubscribers.push(bindNonApple(window, { '$mod+k b': handler }))

		press(window, { key: 'k', code: 'KeyK', ctrlKey: true })
		press(window, { key: 'b', code: 'KeyB' })

		expect(handler).toHaveBeenCalledTimes(1)
	})
})
