import { act, cleanup, render, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntersectionObserver } from './use-intersection-observer'

type Callback = (entries: IntersectionObserverEntry[]) => void

class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = []
	callback: Callback
	options: IntersectionObserverInit
	thresholds: number[]
	observe = vi.fn()
	disconnect = vi.fn()

	constructor(callback: Callback, options: IntersectionObserverInit = {}) {
		this.callback = callback
		this.options = options
		this.thresholds = [options.threshold ?? 0].flat()
		FakeIntersectionObserver.instances.push(this)
	}

	fire(entries: Partial<IntersectionObserverEntry>[]) {
		this.callback(entries as IntersectionObserverEntry[])
	}
}

const makeEntry = (isIntersecting: boolean, intersectionRatio: number) =>
	({ isIntersecting, intersectionRatio }) as IntersectionObserverEntry

const last = () => FakeIntersectionObserver.instances.at(-1) as FakeIntersectionObserver

beforeEach(() => {
	FakeIntersectionObserver.instances = []
	vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
})

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('useIntersectionObserver', () => {
	it('starts not intersecting without an entry', () => {
		const { result } = renderHook(() => useIntersectionObserver())

		expect(result.current.isIntersecting).toBe(false)
		expect(result.current.entry).toBeUndefined()
	})

	it('honours initialIsIntersecting', () => {
		const { result } = renderHook(() => useIntersectionObserver({ initialIsIntersecting: true }))

		expect(result.current.isIntersecting).toBe(true)
	})

	it('does not create an observer before a node is attached', () => {
		renderHook(() => useIntersectionObserver())

		expect(FakeIntersectionObserver.instances).toHaveLength(0)
	})

	it('starts observing when the ref receives a node', () => {
		const { result } = renderHook(() => useIntersectionObserver())
		const node = document.createElement('div')

		act(() => {
			result.current.ref(node)
		})

		expect(FakeIntersectionObserver.instances).toHaveLength(1)
		expect(last().observe).toHaveBeenCalledWith(node)
	})

	it('passes root, rootMargin and a default threshold of [0]', () => {
		const root = document.createElement('section')
		const { result } = renderHook(() => useIntersectionObserver({ root, rootMargin: '10px' }))

		act(() => {
			result.current.ref(document.createElement('div'))
		})

		expect(last().options).toEqual({ threshold: [0], root, rootMargin: '10px' })
	})

	it('updates isIntersecting and entry from observer entries', () => {
		const { result } = renderHook(() => useIntersectionObserver())
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const entry = makeEntry(true, 1)

		act(() => {
			last().fire([entry])
		})

		expect(result.current.isIntersecting).toBe(true)
		expect(result.current.entry).toBe(entry)
	})

	it('reports not intersecting when the entry is not intersecting', () => {
		const { result } = renderHook(() => useIntersectionObserver())
		act(() => {
			result.current.ref(document.createElement('div'))
		})

		act(() => {
			last().fire([makeEntry(true, 1)])
		})
		act(() => {
			last().fire([makeEntry(false, 0)])
		})

		expect(result.current.isIntersecting).toBe(false)
	})

	it('requires the ratio to reach a threshold from observer.thresholds', () => {
		const { result } = renderHook(() => useIntersectionObserver({ threshold: [0.5, 1] }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})

		act(() => {
			last().fire([makeEntry(true, 0.25)])
		})
		expect(result.current.isIntersecting).toBe(false)

		act(() => {
			last().fire([makeEntry(true, 0.5)])
		})
		expect(result.current.isIntersecting).toBe(true)
	})

	it('passes an array threshold to the observer', () => {
		const { result } = renderHook(() => useIntersectionObserver({ threshold: [0.25, 0.75] }))

		act(() => {
			result.current.ref(document.createElement('div'))
		})

		expect(last().options.threshold).toEqual([0.25, 0.75])
	})

	it('passes a numeric threshold to the observer as an array', () => {
		const { result } = renderHook(() => useIntersectionObserver({ threshold: 0.4 }))

		act(() => {
			result.current.ref(document.createElement('div'))
		})

		expect(last().options.threshold).toEqual([0.4])
	})

	it('calls onChange with the intersecting flag and entry', () => {
		const onChange = vi.fn()
		const { result } = renderHook(() => useIntersectionObserver({ onChange }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const entry = makeEntry(true, 1)

		act(() => {
			last().fire([entry])
		})

		expect(onChange).toHaveBeenCalledWith(true, entry)
	})

	it('uses the latest onChange without recreating the observer', () => {
		const first = vi.fn()
		const second = vi.fn()
		const { result, rerender } = renderHook(({ onChange }) => useIntersectionObserver({ onChange }), {
			initialProps: { onChange: first },
		})
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const observer = last()

		rerender({ onChange: second })
		act(() => {
			observer.fire([makeEntry(true, 1)])
		})

		expect(FakeIntersectionObserver.instances).toHaveLength(1)
		expect(observer.disconnect).not.toHaveBeenCalled()
		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
	})

	it('does not recreate the observer when an array threshold has the same values', () => {
		const { result, rerender } = renderHook(() => useIntersectionObserver({ threshold: [0, 0.5, 1] }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})

		rerender()
		rerender()

		expect(FakeIntersectionObserver.instances).toHaveLength(1)
	})

	it('recreates the observer when threshold values change', () => {
		const { result, rerender } = renderHook(({ threshold }) => useIntersectionObserver({ threshold }), {
			initialProps: { threshold: [0, 1] },
		})
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const first = last()

		rerender({ threshold: [0, 0.5] })

		expect(first.disconnect).toHaveBeenCalledTimes(1)
		expect(FakeIntersectionObserver.instances).toHaveLength(2)
	})

	it('stops observing after the first intersection with freezeOnceVisible', () => {
		const { result } = renderHook(() => useIntersectionObserver({ freezeOnceVisible: true }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const observer = last()

		act(() => {
			observer.fire([makeEntry(true, 1)])
		})

		expect(observer.disconnect).toHaveBeenCalledTimes(1)
		expect(FakeIntersectionObserver.instances).toHaveLength(1)
		expect(result.current.isIntersecting).toBe(true)
	})

	it('keeps observing a non-intersecting entry with freezeOnceVisible', () => {
		const { result } = renderHook(() => useIntersectionObserver({ freezeOnceVisible: true }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})

		act(() => {
			last().fire([makeEntry(false, 0)])
		})

		expect(last().disconnect).not.toHaveBeenCalled()
	})

	it('resets state when the node is detached', () => {
		const { result } = renderHook(() => useIntersectionObserver())
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		act(() => {
			last().fire([makeEntry(true, 1)])
		})

		act(() => {
			result.current.ref(null)
		})

		expect(result.current.isIntersecting).toBe(false)
		expect(last().disconnect).toHaveBeenCalled()
	})

	it('resets to initialIsIntersecting when the node is detached', () => {
		const { result } = renderHook(() => useIntersectionObserver({ initialIsIntersecting: true }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		act(() => {
			last().fire([makeEntry(false, 0)])
		})
		expect(result.current.isIntersecting).toBe(false)

		act(() => {
			result.current.ref(null)
		})

		expect(result.current.isIntersecting).toBe(true)
	})

	it('keeps state when the node is detached after freezing', () => {
		const { result } = renderHook(() => useIntersectionObserver({ freezeOnceVisible: true }))
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const entry = makeEntry(true, 1)
		act(() => {
			last().fire([entry])
		})

		act(() => {
			result.current.ref(null)
		})

		expect(result.current.isIntersecting).toBe(true)
		expect(result.current.entry).toBe(entry)
	})

	it('disconnects on unmount', () => {
		const { result, unmount } = renderHook(() => useIntersectionObserver())
		act(() => {
			result.current.ref(document.createElement('div'))
		})

		unmount()

		expect(last().disconnect).toHaveBeenCalledTimes(1)
	})

	it('works as a ref callback on a rendered element', () => {
		const Probe = () => {
			const { ref } = useIntersectionObserver()
			return <div ref={ref} data-testid='probe' />
		}

		const { getByTestId } = render(<Probe />)

		expect(last().observe).toHaveBeenCalledWith(getByTestId('probe'))
	})

	it('does not crash when IntersectionObserver is missing from window', () => {
		Reflect.deleteProperty(globalThis, 'IntersectionObserver')
		const { result } = renderHook(() => useIntersectionObserver())

		expect(() => {
			act(() => {
				result.current.ref(document.createElement('div'))
			})
		}).not.toThrow()
		expect(result.current.isIntersecting).toBe(false)
		expect(FakeIntersectionObserver.instances).toHaveLength(0)
	})

	it('returns a tuple and an object sharing the same values', () => {
		const { result } = renderHook(() => useIntersectionObserver())
		act(() => {
			result.current.ref(document.createElement('div'))
		})
		const entry = makeEntry(true, 1)
		act(() => {
			last().fire([entry])
		})

		const [ref, isIntersecting, currentEntry] = result.current

		expect(Array.isArray(result.current)).toBe(true)
		expect(ref).toBe(result.current.ref)
		expect(result.current[0]).toBe(result.current.ref)
		expect(isIntersecting).toBe(true)
		expect(result.current[1]).toBe(result.current.isIntersecting)
		expect(currentEntry).toBe(entry)
		expect(result.current[2]).toBe(result.current.entry)
	})
})
