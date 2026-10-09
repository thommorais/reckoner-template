import { act, cleanup, renderHook } from '@testing-library/react'
import type { PointerEvent as ReactPointerEvent, SyntheticEvent } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLongPress } from './use-long-press'

beforeEach(() => {
	vi.useFakeTimers()
})

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.restoreAllMocks()
})

const pointer = (clientX = 0, clientY = 0) => ({ clientX, clientY }) as ReactPointerEvent

const setup = (disabled?: boolean) => {
	const onLongPress = vi.fn()
	const hook = renderHook(({ off }) => useLongPress(onLongPress, off), { initialProps: { off: disabled } })
	return { onLongPress, ...hook }
}

describe('useLongPress', () => {
	it('fires after holding for 500ms', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('does not fire before 500ms', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(499)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('fires only once per hold', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(5000)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('fires again on a second hold', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(500)
		})
		act(() => result.current.onPointerUp())
		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onLongPress).toHaveBeenCalledTimes(2)
	})

	it('fires once when a second pointerdown arrives during a hold', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(200)
		})
		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('is cancelled by pointer up', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(300)
		})
		act(() => result.current.onPointerUp())
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('is cancelled by pointer cancel', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer()))
		act(() => result.current.onPointerCancel())
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('is cancelled by horizontal drift over 10px', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(111, 100)))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('is cancelled by vertical drift over 10px', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(100, 89)))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('is cancelled by drift in the negative direction', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(89, 100)))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('is not cancelled by drift of exactly 10px', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(110, 90)))
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('is not cancelled by small drift in both axes', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(105, 94)))
		act(() => result.current.onPointerMove(pointer(98, 103)))
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('measures drift from the pointer down origin', () => {
		const { result, onLongPress } = setup()

		act(() => result.current.onPointerDown(pointer(100, 100)))
		act(() => result.current.onPointerMove(pointer(108, 100)))
		act(() => result.current.onPointerMove(pointer(116, 100)))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('ignores pointer move without a press', () => {
		const { result, onLongPress } = setup()

		expect(() => act(() => result.current.onPointerMove(pointer(500, 500)))).not.toThrow()
		expect(onLongPress).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('does nothing when disabled', () => {
		const { result, onLongPress } = setup(true)

		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('starts working once re-enabled', () => {
		const { result, rerender, onLongPress } = setup(true)

		rerender({ off: false })
		act(() => result.current.onPointerDown(pointer()))
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onLongPress).toHaveBeenCalledTimes(1)
	})

	it('prevents the default context menu', () => {
		const { result } = setup()
		const preventDefault = vi.fn()

		act(() => result.current.onContextMenu({ preventDefault } as unknown as SyntheticEvent))

		expect(preventDefault).toHaveBeenCalledTimes(1)
	})

	it('clears the timer on unmount so the callback never fires', () => {
		const { result, onLongPress, unmount } = setup()

		act(() => result.current.onPointerDown(pointer()))
		unmount()

		expect(vi.getTimerCount()).toBe(0)

		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(onLongPress).not.toHaveBeenCalled()
	})

	it('keeps handler identities stable while inputs are unchanged', () => {
		const { result, rerender } = setup()
		const first = result.current

		rerender({ off: undefined })

		expect(result.current.onPointerDown).toBe(first.onPointerDown)
		expect(result.current.onPointerMove).toBe(first.onPointerMove)
		expect(result.current.onPointerUp).toBe(first.onPointerUp)
		expect(result.current.onPointerCancel).toBe(first.onPointerCancel)
		expect(result.current.onContextMenu).toBe(first.onContextMenu)
	})
})
