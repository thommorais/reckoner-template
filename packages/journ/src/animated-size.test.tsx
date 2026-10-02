import { animate } from 'animejs'
import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnimatedSize } from './animated-size'

vi.mock('animejs', () => ({ animate: vi.fn() }))

let notify: (width: number, height: number) => void = () => undefined
let observer: CapturingObserver | undefined

class CapturingObserver {
	constructor(callback: ResizeObserverCallback) {
		observer = this
		notify = (width, height) => callback([{ contentRect: { width, height } } as ResizeObserverEntry], this as never)
	}
	observe = vi.fn()
	unobserve = vi.fn()
	disconnect = vi.fn()
}

const original = globalThis.ResizeObserver

describe('AnimatedSize', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		globalThis.ResizeObserver = CapturingObserver as unknown as typeof ResizeObserver
	})

	afterEach(() => {
		globalThis.ResizeObserver = original
	})

	const box = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-slot=animated-size]')!

	it('jumps to the first measured size without animating', () => {
		const { container } = render(<AnimatedSize>content</AnimatedSize>)

		notify(100, 40)

		expect(box(container).style.height).toBe('40px')
		expect(animate).not.toHaveBeenCalled()
	})

	it('animates the height when the content changes size afterwards', () => {
		const { container } = render(<AnimatedSize>content</AnimatedSize>)
		notify(100, 40)

		notify(100, 90)

		expect(animate).toHaveBeenCalledTimes(1)
		expect(vi.mocked(animate).mock.calls[0]?.[1]).toMatchObject({ height: [expect.any(Number), 90] })
		expect(vi.mocked(animate).mock.calls[0]?.[1]).not.toHaveProperty('width')
		expect(box(container)).toBeTruthy()
	})

	it('animates the width when asked, and leaves the height alone when height is off', () => {
		render(
			<AnimatedSize width height={false}>
				content
			</AnimatedSize>,
		)
		notify(50, 20)

		notify(120, 20)

		const keyframes = vi.mocked(animate).mock.calls[0]?.[1]
		expect(keyframes).toMatchObject({ width: [expect.any(Number), 120] })
		expect(keyframes).not.toHaveProperty('height')
	})

	it('observes its content and stops when it unmounts', () => {
		const { unmount } = render(<AnimatedSize>content</AnimatedSize>)
		expect(observer?.observe).toHaveBeenCalledTimes(1)

		unmount()

		expect(observer?.disconnect).toHaveBeenCalledTimes(1)
	})
})
