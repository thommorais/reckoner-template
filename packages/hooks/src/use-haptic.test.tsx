import { logger } from '@thom/libs/logger'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHaptic, useHapticsConfirm, useHapticsError } from './use-haptic'

vi.mock('@thom/libs/logger', () => ({ logger: { error: vi.fn() } }))

const setVibrate = (fn: unknown) => {
	Object.defineProperty(navigator, 'vibrate', { value: fn, configurable: true, writable: true })
}

const removeVibrate = () => {
	Reflect.deleteProperty(navigator, 'vibrate')
}

const spyClick = () => {
	const seen: { label: HTMLLabelElement; attached: boolean; input: HTMLInputElement | null }[] = []
	const spy = vi.spyOn(HTMLLabelElement.prototype, 'click').mockImplementation(function (this: HTMLLabelElement) {
		seen.push({
			label: this,
			attached: document.body.contains(this),
			input: document.body.querySelector<HTMLInputElement>('input[switch]'),
		})
	})
	return { spy, seen }
}

beforeEach(() => {
	removeVibrate()
	document.body.innerHTML = ''
})

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
	vi.mocked(logger.error).mockClear()
	removeVibrate()
	document.body.innerHTML = ''
})

describe('useHaptic with navigator.vibrate', () => {
	it('vibrates 50ms by default', () => {
		const vibrate = vi.fn()
		setVibrate(vibrate)
		const { result } = renderHook(() => useHaptic())

		result.current()

		expect(vibrate).toHaveBeenCalledWith(50)
	})

	it('passes a numeric duration through', () => {
		const vibrate = vi.fn()
		setVibrate(vibrate)
		const { result } = renderHook(() => useHaptic())

		result.current(120)

		expect(vibrate).toHaveBeenCalledWith(120)
	})

	it('passes array durations through', () => {
		const vibrate = vi.fn()
		setVibrate(vibrate)
		const { result } = renderHook(() => useHaptic())

		result.current([10, 20, 30])

		expect(vibrate).toHaveBeenCalledWith([10, 20, 30])
	})

	it('does not touch the DOM', () => {
		setVibrate(vi.fn())
		const { spy } = spyClick()
		const { result } = renderHook(() => useHaptic())

		result.current()

		expect(spy).not.toHaveBeenCalled()
		expect(document.body.querySelector('input, label')).toBeNull()
	})

	it('returns a stable function', () => {
		const { result, rerender } = renderHook(() => useHaptic())
		const first = result.current

		rerender()

		expect(result.current).toBe(first)
	})
})

describe('useHaptic without navigator.vibrate', () => {
	it('appends a hidden switch checkbox and a label, clicks the label, then removes both', () => {
		const appended: Node[] = []
		const appendChild = document.body.appendChild.bind(document.body)
		vi.spyOn(document.body, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
			appended.push(node)
			return appendChild(node)
		})
		const { spy, seen } = spyClick()
		const { result } = renderHook(() => useHaptic())

		result.current()

		const input = appended.find((node): node is HTMLInputElement => node instanceof HTMLInputElement)
		const label = appended.find((node): node is HTMLLabelElement => node instanceof HTMLLabelElement)
		expect(input?.type).toBe('checkbox')
		expect(input?.hasAttribute('switch')).toBe(true)
		expect(input?.id).toBeTruthy()
		expect(label?.htmlFor).toBe(input?.id)
		expect(input?.style.opacity).toBe('0')
		expect(label?.style.pointerEvents).toBe('none')
		expect(spy).toHaveBeenCalledTimes(1)
		expect(seen[0]?.label).toBe(label)
		expect(seen[0]?.attached).toBe(true)
		expect(seen[0]?.input).toBe(input)
		expect(document.body.querySelector('input, label')).toBeNull()
	})

	it('uses a different input id on each trigger', () => {
		const { seen } = spyClick()
		const { result } = renderHook(() => useHaptic())

		result.current()
		result.current()

		expect(seen).toHaveLength(2)
		expect(seen[0]?.label.htmlFor).not.toBe(seen[1]?.label.htmlFor)
	})

	it('triggers immediately for a numeric duration', () => {
		const { spy } = spyClick()
		const { result } = renderHook(() => useHaptic())

		result.current(500)

		expect(spy).toHaveBeenCalledTimes(1)
	})

	it('schedules one timer per array entry with a 101ms floor', () => {
		vi.useFakeTimers()
		const { spy } = spyClick()
		const { result } = renderHook(() => useHaptic())

		result.current([10, 300])

		expect(spy).not.toHaveBeenCalled()
		vi.advanceTimersByTime(100)
		expect(spy).not.toHaveBeenCalled()
		vi.advanceTimersByTime(1)
		expect(spy).toHaveBeenCalledTimes(1)
		vi.advanceTimersByTime(198)
		expect(spy).toHaveBeenCalledTimes(1)
		vi.advanceTimersByTime(1)
		expect(spy).toHaveBeenCalledTimes(2)
	})

	it('logs and does not throw when the click fails', () => {
		const error = new Error('click failed')
		vi.spyOn(HTMLLabelElement.prototype, 'click').mockImplementation(() => {
			throw error
		})
		const { result } = renderHook(() => useHaptic())

		expect(() => result.current()).not.toThrow()
		expect(logger.error).toHaveBeenCalledWith(
			'Error triggering iOS haptic:',
			expect.objectContaining({ message: error.message }),
		)
	})
})

describe('useHapticsError', () => {
	it('vibrates the error pattern when vibrate is supported', () => {
		const vibrate = vi.fn()
		setVibrate(vibrate)
		const { result } = renderHook(() => useHapticsError())

		result.current()

		expect(vibrate).toHaveBeenCalledTimes(1)
		expect(vibrate).toHaveBeenCalledWith([40, 60, 40, 60, 40, 60, 40])
	})

	it('triggers once now and schedules 3 pulses at 100, 200 and 300ms without vibrate', () => {
		vi.useFakeTimers()
		const { spy } = spyClick()
		const { result } = renderHook(() => useHapticsError())

		result.current()
		expect(spy).toHaveBeenCalledTimes(1)

		vi.advanceTimersByTime(99)
		expect(spy).toHaveBeenCalledTimes(1)
		vi.advanceTimersByTime(1)
		expect(spy).toHaveBeenCalledTimes(2)
		vi.advanceTimersByTime(100)
		expect(spy).toHaveBeenCalledTimes(3)
		vi.advanceTimersByTime(100)
		expect(spy).toHaveBeenCalledTimes(4)
		vi.advanceTimersByTime(1000)
		expect(spy).toHaveBeenCalledTimes(4)
	})

	it('clears pending pulses on unmount', () => {
		vi.useFakeTimers()
		const { spy } = spyClick()
		const { result, unmount } = renderHook(() => useHapticsError())

		result.current()
		unmount()
		vi.advanceTimersByTime(1000)

		expect(spy).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(0)
	})

	it('logs and does not throw when vibrate throws', () => {
		const error = new Error('vibrate failed')
		setVibrate(() => {
			throw error
		})
		const { result } = renderHook(() => useHapticsError())

		expect(() => result.current()).not.toThrow()
		expect(logger.error).toHaveBeenCalledWith(
			'Error triggering error haptic:',
			expect.objectContaining({ message: error.message }),
		)
	})

	it('returns a stable callback', () => {
		const { result, rerender } = renderHook(() => useHapticsError())
		const first = result.current

		rerender()

		expect(result.current).toBe(first)
	})
})

describe('useHapticsConfirm', () => {
	it('vibrates [100] when vibrate is supported', () => {
		const vibrate = vi.fn()
		setVibrate(vibrate)
		const { result } = renderHook(() => useHapticsConfirm())

		result.current()

		expect(vibrate).toHaveBeenCalledWith([100])
	})

	it('schedules a single delayed pulse without vibrate', () => {
		vi.useFakeTimers()
		const { spy } = spyClick()
		const { result } = renderHook(() => useHapticsConfirm())

		result.current()
		expect(spy).not.toHaveBeenCalled()
		act(() => {
			vi.advanceTimersByTime(101)
		})

		expect(spy).toHaveBeenCalledTimes(1)
	})

	it('logs and does not throw when vibrate throws', () => {
		const error = new Error('vibrate failed')
		setVibrate(() => {
			throw error
		})
		const { result } = renderHook(() => useHapticsConfirm())

		expect(() => result.current()).not.toThrow()
		expect(logger.error).toHaveBeenCalledWith(
			'Error triggering confirm haptic:',
			expect.objectContaining({ message: error.message }),
		)
	})
})

describe('supportsHaptics', () => {
	const load = async () => {
		vi.resetModules()
		const module = await import('./use-haptic')
		return module.supportsHaptics
	}

	it('is true when navigator.vibrate exists', async () => {
		setVibrate(vi.fn())

		expect(await load()).toBe(true)
	})

	it('is true without vibrate when the switch attribute is supported', async () => {
		expect(await load()).toBe(true)
	})

	it('is false when there is no window', async () => {
		vi.stubGlobal('window', undefined)
		setVibrate(vi.fn())

		expect(await load()).toBe(false)
	})

	it('is false without vibrate when document is unavailable', async () => {
		vi.stubGlobal('document', undefined)

		expect(await load()).toBe(false)
	})

	it('is false without vibrate when setting the switch attribute throws', async () => {
		vi.spyOn(HTMLInputElement.prototype, 'setAttribute').mockImplementation(() => {
			throw new Error('unsupported')
		})

		expect(await load()).toBe(false)
	})
})
