import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isFixed, isPinned, isReleased, useHeadroom } from './use-headroom'

afterEach(() => {
	cleanup()
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

const scrollTo = (y: number, x = 0) => {
	act(() => {
		vi.stubGlobal('scrollX', x)
		vi.stubGlobal('scrollY', y)
		window.dispatchEvent(new Event('scroll'))
	})
}

const setup = (input?: Parameters<typeof useHeadroom>[0]) => {
	vi.stubGlobal('scrollX', 0)
	vi.stubGlobal('scrollY', 0)
	return renderHook(() => useHeadroom(input))
}

describe('isFixed', () => {
	it.each([
		{ current: 0, fixedAt: 0, expected: true },
		{ current: -5, fixedAt: 0, expected: true },
		{ current: 10, fixedAt: 10, expected: true },
		{ current: 11, fixedAt: 10, expected: false },
	])('isFixed($current, $fixedAt) is $expected', ({ current, fixedAt, expected }) => {
		expect(isFixed(current, fixedAt)).toBe(expected)
	})
})

describe('isPinned', () => {
	it.each([
		{ current: 5, previous: 10, expected: true },
		{ current: 10, previous: 10, expected: true },
		{ current: 11, previous: 10, expected: false },
	])('isPinned($current, $previous) is $expected', ({ current, previous, expected }) => {
		expect(isPinned(current, previous)).toBe(expected)
	})
})

describe('isReleased', () => {
	it.each([
		{ current: 20, previous: 10, fixedAt: 5, expected: true },
		{ current: 6, previous: 5, fixedAt: 5, expected: true },
		{ current: 10, previous: 10, fixedAt: 5, expected: false },
		{ current: 8, previous: 10, fixedAt: 5, expected: false },
		{ current: 3, previous: 2, fixedAt: 5, expected: false },
		{ current: 5, previous: 4, fixedAt: 5, expected: false },
	])('isReleased($current, $previous, $fixedAt) is $expected', ({ current, previous, fixedAt, expected }) => {
		expect(isReleased(current, previous, fixedAt)).toBe(expected)
	})
})

describe('useHeadroom', () => {
	it('is pinned with full progress at the top', () => {
		const { result } = setup()

		expect(result.current).toEqual({ pinned: true, scrollProgress: 1 })
	})

	it('stays pinned while within fixedAt', () => {
		const { result } = setup({ fixedAt: 50 })

		scrollTo(40)

		expect(result.current).toEqual({ pinned: true, scrollProgress: 1 })
	})

	it('releases when scrolling down past a distance', () => {
		const { result } = setup()

		scrollTo(200)

		expect(result.current).toEqual({ pinned: false, scrollProgress: 0 })
	})

	it('reduces progress proportionally to scrollDistance when scrolling down', () => {
		const { result } = setup()

		scrollTo(25)
		expect(result.current.scrollProgress).toBe(0.75)
		expect(result.current.pinned).toBe(true)

		scrollTo(50)
		expect(result.current.scrollProgress).toBe(0.5)

		scrollTo(75)
		expect(result.current.scrollProgress).toBe(0.25)
	})

	it('honours a custom scrollDistance', () => {
		const { result } = setup({ scrollDistance: 200 })

		scrollTo(50)

		expect(result.current.scrollProgress).toBe(0.75)
	})

	it('measures progress from fixedAt rather than from 0', () => {
		const { result } = setup({ fixedAt: 50 })

		scrollTo(60)

		expect(result.current.scrollProgress).toBe(0.9)
	})

	it('clamps progress to 0 when scrolling far down', () => {
		const { result } = setup()

		scrollTo(1000)

		expect(result.current.scrollProgress).toBe(0)
		expect(result.current.pinned).toBe(false)
	})

	it('pins when scrolling up', () => {
		const { result } = setup()

		scrollTo(200)
		scrollTo(190)
		scrollTo(140)

		expect(result.current.pinned).toBe(true)
		expect(result.current.scrollProgress).toBe(0.5)
	})

	it('reveals in proportion to the distance scrolled back up', () => {
		const { result } = setup()

		scrollTo(500)
		scrollTo(490)
		scrollTo(465)
		expect(result.current.scrollProgress).toBe(0.25)

		scrollTo(440)
		expect(result.current.scrollProgress).toBe(0.5)
	})

	it('reveals in proportion to the first upward jump after scrolling down', () => {
		const { result } = setup()

		scrollTo(200)
		scrollTo(150)

		expect(result.current.scrollProgress).toBe(0.5)
	})

	it('clamps progress to 1 when scrolling far back up without reaching the top', () => {
		const { result } = setup()

		scrollTo(500)
		scrollTo(490)
		scrollTo(300)

		expect(result.current.scrollProgress).toBe(1)
		expect(result.current.pinned).toBe(true)
	})

	it('releases again after pinning when scrolling back down', () => {
		const { result } = setup()

		scrollTo(500)
		scrollTo(490)
		scrollTo(440)
		scrollTo(450)
		scrollTo(500)
		scrollTo(600)

		expect(result.current.scrollProgress).toBe(0)
		expect(result.current.pinned).toBe(false)
	})

	it('returns to fixed with full progress when scrolled back to the top', () => {
		const { result } = setup()

		scrollTo(300)
		scrollTo(0)

		expect(result.current).toEqual({ pinned: true, scrollProgress: 1 })
	})

	it('ignores horizontal scroll position', () => {
		const { result } = setup()

		scrollTo(0, 400)

		expect(result.current).toEqual({ pinned: true, scrollProgress: 1 })
	})

	describe('callbacks', () => {
		const setupWithCallbacks = (input?: { fixedAt?: number; scrollDistance?: number }) => {
			const onPin = vi.fn()
			const onFix = vi.fn()
			const onRelease = vi.fn()
			const hook = setup({ ...input, onPin, onFix, onRelease })
			onPin.mockClear()
			onFix.mockClear()
			onRelease.mockClear()
			return { onPin, onFix, onRelease, ...hook }
		}

		it('calls onRelease once when scrolling down past fixedAt', () => {
			const { onRelease, onPin, onFix } = setupWithCallbacks()

			scrollTo(200)
			scrollTo(300)
			scrollTo(400)

			expect(onRelease).toHaveBeenCalledTimes(1)
			expect(onPin).not.toHaveBeenCalled()
			expect(onFix).not.toHaveBeenCalled()
		})

		it('does not call onRelease while within fixedAt', () => {
			const { onRelease } = setupWithCallbacks({ fixedAt: 50 })

			scrollTo(30)
			scrollTo(50)

			expect(onRelease).not.toHaveBeenCalled()
		})

		it('calls onPin once when scrolling up after a release', () => {
			const { onPin, onRelease } = setupWithCallbacks()

			scrollTo(200)
			expect(onPin).not.toHaveBeenCalled()

			scrollTo(190)
			scrollTo(180)
			scrollTo(170)

			expect(onPin).toHaveBeenCalledTimes(1)
			expect(onRelease).toHaveBeenCalledTimes(1)
		})

		it('calls onRelease again after pinning and scrolling back down', () => {
			const { onPin, onRelease } = setupWithCallbacks()

			scrollTo(200)
			scrollTo(190)
			scrollTo(250)

			expect(onPin).toHaveBeenCalledTimes(1)
			expect(onRelease).toHaveBeenCalledTimes(2)
		})

		it('calls onFix and onPin when returning to the top', () => {
			const { onFix, onPin } = setupWithCallbacks()

			scrollTo(200)
			scrollTo(0)

			expect(onFix).toHaveBeenCalledTimes(1)
			expect(onPin).toHaveBeenCalledTimes(1)
		})

		it('does not call onFix while scrolling outside the fixed zone', () => {
			const { onFix } = setupWithCallbacks()

			scrollTo(200)
			scrollTo(190)
			scrollTo(300)

			expect(onFix).not.toHaveBeenCalled()
		})

		it('does not call onFix again for scrolls that stay fixed', () => {
			const { onFix } = setupWithCallbacks({ fixedAt: 50 })

			scrollTo(10)
			scrollTo(30)

			expect(onFix).not.toHaveBeenCalled()
		})

		it('uses the latest callbacks without re-subscribing', () => {
			vi.stubGlobal('scrollX', 0)
			vi.stubGlobal('scrollY', 0)
			const first = vi.fn()
			const second = vi.fn()
			const { rerender } = renderHook(({ onRelease }) => useHeadroom({ onRelease }), {
				initialProps: { onRelease: first },
			})

			rerender({ onRelease: second })
			scrollTo(200)

			expect(second).toHaveBeenCalledTimes(1)
			expect(first).not.toHaveBeenCalled()
		})
	})
})
