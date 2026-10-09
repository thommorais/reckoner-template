import { act, cleanup, render, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMeasure } from './use-measure'

type Callback = (entries: Partial<ResizeObserverEntry>[]) => void

class FakeResizeObserver {
	static instances: FakeResizeObserver[] = []
	callback: Callback
	observe = vi.fn()
	disconnect = vi.fn()

	constructor(callback: Callback) {
		this.callback = callback
		FakeResizeObserver.instances.push(this)
	}

	fire(entries: Partial<ResizeObserverEntry>[]) {
		this.callback(entries)
	}
}

const box = (inlineSize: number, blockSize: number) => ({ inlineSize, blockSize }) as ResizeObserverSize

const last = () => FakeResizeObserver.instances.at(-1) as FakeResizeObserver

beforeEach(() => {
	FakeResizeObserver.instances = []
	vi.stubGlobal('ResizeObserver', FakeResizeObserver)
})

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('useMeasure', () => {
	it('returns a ref and null dimensions initially', () => {
		const { result } = renderHook(() => useMeasure())

		expect(typeof result.current[0]).toBe('function')
		expect(result.current[1]).toEqual({ width: null, height: null })
	})

	it('keeps a stable ref across renders', () => {
		const { result, rerender } = renderHook(() => useMeasure())
		const ref = result.current[0]

		rerender()

		expect(result.current[0]).toBe(ref)
	})

	it('observes the element passed to the ref', () => {
		const { result } = renderHook(() => useMeasure())
		const node = document.createElement('div')

		act(() => {
			result.current[0](node)
		})

		expect(FakeResizeObserver.instances).toHaveLength(1)
		expect(last().observe).toHaveBeenCalledWith(node)
	})

	it('updates dimensions from the border box size', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})

		act(() => {
			last().fire([{ borderBoxSize: [box(120, 80)] }])
		})

		expect(result.current[1]).toEqual({ width: 120, height: 80 })
	})

	it('updates again on a later resize', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})

		act(() => {
			last().fire([{ borderBoxSize: [box(120, 80)] }])
		})
		act(() => {
			last().fire([{ borderBoxSize: [box(300, 40)] }])
		})

		expect(result.current[1]).toEqual({ width: 300, height: 40 })
	})

	it('resets to nulls when borderBoxSize is an empty array', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		act(() => {
			last().fire([{ borderBoxSize: [box(120, 80)] }])
		})

		act(() => {
			last().fire([{ borderBoxSize: [] }])
		})

		expect(result.current[1]).toEqual({ width: null, height: null })
	})

	it('ignores entries without borderBoxSize', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		act(() => {
			last().fire([{ borderBoxSize: [box(120, 80)] }])
		})

		act(() => {
			last().fire([{}])
		})

		expect(result.current[1]).toEqual({ width: 120, height: 80 })
	})

	it('ignores an empty entries list', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})

		act(() => {
			last().fire([])
		})

		expect(result.current[1]).toEqual({ width: null, height: null })
	})

	it('disconnects the previous observer when the node changes', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		const first = last()

		act(() => {
			result.current[0](document.createElement('span'))
		})

		expect(first.disconnect).toHaveBeenCalledTimes(1)
		expect(FakeResizeObserver.instances).toHaveLength(2)
		expect(last().disconnect).not.toHaveBeenCalled()
	})

	it('disconnects and creates no observer when the node becomes null', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		const first = last()

		act(() => {
			result.current[0](null)
		})

		expect(first.disconnect).toHaveBeenCalledTimes(1)
		expect(FakeResizeObserver.instances).toHaveLength(1)
	})

	it('does not disconnect the same observer twice', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		const first = last()

		act(() => {
			result.current[0](null)
		})
		act(() => {
			result.current[0](null)
		})

		expect(first.disconnect).toHaveBeenCalledTimes(1)
	})

	it('ignores non-element nodes', () => {
		const { result } = renderHook(() => useMeasure())

		act(() => {
			result.current[0](document.createTextNode('text') as unknown as Element)
		})

		expect(FakeResizeObserver.instances).toHaveLength(0)
	})

	it('disconnects the previous observer when a non-element node follows an element', () => {
		const { result } = renderHook(() => useMeasure())
		act(() => {
			result.current[0](document.createElement('div'))
		})
		const first = last()

		act(() => {
			result.current[0](document.createTextNode('text') as unknown as Element)
		})

		expect(first.disconnect).toHaveBeenCalledTimes(1)
		expect(FakeResizeObserver.instances).toHaveLength(1)
	})

	it('disconnects on unmount of a rendered element', () => {
		const Probe = () => {
			const [ref] = useMeasure()
			return <div ref={ref} />
		}
		const { unmount } = render(<Probe />)
		const observer = last()

		unmount()

		expect(observer.disconnect).toHaveBeenCalledTimes(1)
	})
})
