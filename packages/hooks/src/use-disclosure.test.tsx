import { act, cleanup, renderHook } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDisclosure } from './use-disclosure'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useDisclosure', () => {
	it('starts closed by default', () => {
		const { result } = renderHook(() => useDisclosure())

		expect(result.current[0]).toBe(false)
	})

	it('starts with the given initial state', () => {
		const { result } = renderHook(() => useDisclosure(true))

		expect(result.current[0]).toBe(true)
	})

	it('opens', () => {
		const { result } = renderHook(() => useDisclosure())

		act(() => result.current[1].open())

		expect(result.current[0]).toBe(true)
	})

	it('closes', () => {
		const { result } = renderHook(() => useDisclosure(true))

		act(() => result.current[1].close())

		expect(result.current[0]).toBe(false)
	})

	it('toggles back and forth', () => {
		const { result } = renderHook(() => useDisclosure())

		act(() => result.current[1].toggle())
		expect(result.current[0]).toBe(true)

		act(() => result.current[1].toggle())
		expect(result.current[0]).toBe(false)
	})

	it('sets an explicit value', () => {
		const { result } = renderHook(() => useDisclosure())

		act(() => result.current[1].set(true))
		expect(result.current[0]).toBe(true)

		act(() => result.current[1].set(false))
		expect(result.current[0]).toBe(false)
	})

	it('keeps handler identities stable across renders', () => {
		const { result, rerender } = renderHook(() => useDisclosure())
		const { open, close, toggle } = result.current[1]

		act(() => result.current[1].open())
		rerender()

		expect(result.current[1].open).toBe(open)
		expect(result.current[1].close).toBe(close)
		expect(result.current[1].toggle).toBe(toggle)
	})

	it('does not call onOpen or onClose on mount', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()

		renderHook(() => useDisclosure(true, { onOpen, onClose }))
		renderHook(() => useDisclosure(false, { onOpen, onClose }))

		expect(onOpen).not.toHaveBeenCalled()
		expect(onClose).not.toHaveBeenCalled()
	})

	it('does not call onOpen or onClose on mount under StrictMode', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()

		renderHook(() => useDisclosure(true, { onOpen, onClose }), { wrapper: StrictMode })
		renderHook(() => useDisclosure(false, { onOpen, onClose }), { wrapper: StrictMode })

		expect(onOpen).not.toHaveBeenCalled()
		expect(onClose).not.toHaveBeenCalled()
	})

	it('calls onOpen once when opening under StrictMode', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()
		const { result } = renderHook(() => useDisclosure(false, { onOpen, onClose }), { wrapper: StrictMode })

		act(() => result.current[1].open())

		expect(onOpen).toHaveBeenCalledTimes(1)
		expect(onClose).not.toHaveBeenCalled()
	})

	it('calls onOpen when opened and onClose when closed', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()
		const { result } = renderHook(() => useDisclosure(false, { onOpen, onClose }))

		act(() => result.current[1].open())
		expect(onOpen).toHaveBeenCalledTimes(1)
		expect(onClose).not.toHaveBeenCalled()

		act(() => result.current[1].close())
		expect(onOpen).toHaveBeenCalledTimes(1)
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('calls the callbacks on toggle and set', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()
		const { result } = renderHook(() => useDisclosure(false, { onOpen, onClose }))

		act(() => result.current[1].toggle())
		act(() => result.current[1].toggle())
		act(() => result.current[1].set(true))
		act(() => result.current[1].set(false))

		expect(onOpen).toHaveBeenCalledTimes(2)
		expect(onClose).toHaveBeenCalledTimes(2)
	})

	it('does not call onOpen when already open', () => {
		const onOpen = vi.fn()
		const { result } = renderHook(() => useDisclosure(true, { onOpen }))

		act(() => result.current[1].open())
		act(() => result.current[1].set(true))

		expect(onOpen).not.toHaveBeenCalled()
	})

	it('does not call onClose when already closed', () => {
		const onClose = vi.fn()
		const { result } = renderHook(() => useDisclosure(false, { onClose }))

		act(() => result.current[1].close())
		act(() => result.current[1].set(false))

		expect(onClose).not.toHaveBeenCalled()
	})

	it('does not call a callback on rerender without a change', () => {
		const onOpen = vi.fn()
		const onClose = vi.fn()
		const { rerender } = renderHook(() => useDisclosure(false, { onOpen, onClose }))

		rerender()
		rerender()

		expect(onOpen).not.toHaveBeenCalled()
		expect(onClose).not.toHaveBeenCalled()
	})

	it('works without callbacks', () => {
		const { result } = renderHook(() => useDisclosure())

		expect(() => {
			act(() => result.current[1].open())
			act(() => result.current[1].close())
		}).not.toThrow()
	})

	it('uses the latest callbacks when their identity changes', () => {
		const firstOpen = vi.fn()
		const secondOpen = vi.fn()
		const firstClose = vi.fn()
		const secondClose = vi.fn()
		const { result, rerender } = renderHook(({ onOpen, onClose }) => useDisclosure(false, { onOpen, onClose }), {
			initialProps: { onOpen: firstOpen, onClose: firstClose },
		})

		rerender({ onOpen: secondOpen, onClose: secondClose })

		act(() => result.current[1].open())
		expect(secondOpen).toHaveBeenCalledTimes(1)
		expect(firstOpen).not.toHaveBeenCalled()

		act(() => result.current[1].close())
		expect(secondClose).toHaveBeenCalledTimes(1)
		expect(firstClose).not.toHaveBeenCalled()
	})

	it('does not fire callbacks when only their identity changes', () => {
		const firstOpen = vi.fn()
		const secondOpen = vi.fn()
		const { rerender } = renderHook(({ onOpen }) => useDisclosure(true, { onOpen }), {
			initialProps: { onOpen: firstOpen },
		})

		rerender({ onOpen: secondOpen })

		expect(firstOpen).not.toHaveBeenCalled()
		expect(secondOpen).not.toHaveBeenCalled()
	})
})
