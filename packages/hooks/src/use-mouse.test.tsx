import { act, cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMouse, useMousePosition } from './use-mouse'

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

type ProbeProps = {
	resetOnExit?: boolean
	nodeKey?: string
}

const Probe = ({ resetOnExit, nodeKey = 'a' }: ProbeProps) => {
	const { ref, x, y } = useMouse<HTMLDivElement>({ resetOnExit })

	return (
		<div key={nodeKey} ref={ref} data-testid='box'>
			{x},{y}
		</div>
	)
}

const mockRect = (element: Element, left: number, top: number) =>
	vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
		left,
		top,
		right: left + 100,
		bottom: top + 100,
		width: 100,
		height: 100,
		x: left,
		y: top,
		toJSON: () => ({}),
	})

const setup = (props: ProbeProps = {}, left = 10, top = 20) => {
	const utils = render(<Probe {...props} />)
	const box = utils.getByTestId('box')
	mockRect(box, left, top)
	return { ...utils, box }
}

describe('useMouse', () => {
	it('starts at the origin', () => {
		const { box } = setup()

		expect(box.textContent).toBe('0,0')
	})

	it('reports the position relative to the element', () => {
		const { box } = setup()

		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })

		expect(box.textContent).toBe('50,70')
	})

	it('rounds fractional positions', () => {
		const { box } = setup()

		fireEvent.mouseMove(box, { clientX: 15.6, clientY: 20.4 })

		expect(box.textContent).toBe('6,0')
	})

	it('clamps negative positions to 0', () => {
		const { box } = setup()

		fireEvent.mouseMove(box, { clientX: 2, clientY: 5 })

		expect(box.textContent).toBe('0,0')
	})

	it('reads the bounding rect on every move', () => {
		const { box } = setup()

		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })
		mockRect(box, 30, 40)
		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })

		expect(box.textContent).toBe('30,50')
	})

	it('keeps the last position on mouseleave by default', () => {
		const { box } = setup()

		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })
		fireEvent.mouseLeave(box)

		expect(box.textContent).toBe('50,70')
	})

	it('resets to the origin on mouseleave with resetOnExit', () => {
		const { box } = setup({ resetOnExit: true })

		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })
		expect(box.textContent).toBe('50,70')

		fireEvent.mouseLeave(box)
		expect(box.textContent).toBe('0,0')
	})

	it('picks up resetOnExit changes', () => {
		const { box, rerender } = setup({ resetOnExit: false })

		rerender(<Probe resetOnExit />)
		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })
		fireEvent.mouseLeave(box)

		expect(box.textContent).toBe('0,0')
	})

	it('stops resetting when resetOnExit is turned off', () => {
		const { box, rerender } = setup({ resetOnExit: true })

		rerender(<Probe resetOnExit={false} />)
		fireEvent.mouseMove(box, { clientX: 60, clientY: 90 })
		fireEvent.mouseLeave(box)

		expect(box.textContent).toBe('50,70')
	})

	it('removes its listeners on unmount', () => {
		const { box, unmount } = setup({ resetOnExit: true })
		const remove = vi.spyOn(box, 'removeEventListener')

		unmount()

		expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function))
		expect(remove).toHaveBeenCalledWith('mouseleave', expect.any(Function))
	})

	it('adds exactly one mousemove listener', () => {
		const target = document.createElement('div')
		const add = vi.spyOn(target, 'addEventListener')
		const { result } = renderHook(() => useMouse<HTMLDivElement>())

		act(() => {
			result.current.ref(target)
		})

		expect(add.mock.calls.filter(([type]) => type === 'mousemove')).toHaveLength(1)
		expect(add.mock.calls.filter(([type]) => type === 'mouseleave')).toHaveLength(0)
	})

	it('adds a mouseleave listener only with resetOnExit', () => {
		const target = document.createElement('div')
		const add = vi.spyOn(target, 'addEventListener')
		const { result } = renderHook(() => useMouse<HTMLDivElement>({ resetOnExit: true }))

		act(() => {
			result.current.ref(target)
		})

		expect(add.mock.calls.filter(([type]) => type === 'mouseleave')).toHaveLength(1)
	})

	it('ignores a null node', () => {
		const { result } = renderHook(() => useMouse<HTMLDivElement>())

		expect(() => result.current.ref(null)).not.toThrow()
	})

	it('stops tracking the old node when the element is replaced', () => {
		const { box: oldBox, rerender, getByTestId } = setup()

		rerender(<Probe nodeKey='b' />)
		const newBox = getByTestId('box')
		mockRect(newBox, 0, 0)

		expect(newBox).not.toBe(oldBox)

		fireEvent.mouseMove(oldBox, { clientX: 60, clientY: 90 })
		expect(newBox.textContent).toBe('0,0')

		fireEvent.mouseMove(newBox, { clientX: 7, clientY: 9 })
		expect(newBox.textContent).toBe('7,9')
	})

	it('removes listeners from the old node when the element is replaced', () => {
		const { box: oldBox, rerender } = setup()
		const remove = vi.spyOn(oldBox, 'removeEventListener')

		rerender(<Probe nodeKey='b' />)

		expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function))
	})
})

describe('useMousePosition', () => {
	it('starts at the origin', () => {
		const { result } = renderHook(() => useMousePosition())

		expect(result.current).toEqual({ x: 0, y: 0 })
	})

	it('tracks window mousemove clientX and clientY', () => {
		const { result } = renderHook(() => useMousePosition())

		fireEvent.mouseMove(window, { clientX: 120, clientY: 340 })
		expect(result.current).toEqual({ x: 120, y: 340 })

		fireEvent.mouseMove(window, { clientX: 5, clientY: 6 })
		expect(result.current).toEqual({ x: 5, y: 6 })
	})

	it('does not round or clamp', () => {
		const { result } = renderHook(() => useMousePosition())

		fireEvent.mouseMove(window, { clientX: -3, clientY: 4.5 })

		expect(result.current).toEqual({ x: -3, y: 4.5 })
	})

	it('removes the window listener on unmount', () => {
		const remove = vi.spyOn(window, 'removeEventListener')
		const { unmount } = renderHook(() => useMousePosition())

		unmount()

		expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function), undefined)
	})

	it('stops updating after unmount', () => {
		const { result, unmount } = renderHook(() => useMousePosition())

		fireEvent.mouseMove(window, { clientX: 1, clientY: 2 })
		unmount()
		fireEvent.mouseMove(window, { clientX: 9, clientY: 9 })

		expect(result.current).toEqual({ x: 1, y: 2 })
	})
})
