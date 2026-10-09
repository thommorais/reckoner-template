import { logger } from '@thom/libs/logger'
import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLogger } from './use-logger'

vi.mock('@thom/libs/logger', () => ({ logger: { log: vi.fn() } }))

afterEach(() => {
	cleanup()
	vi.mocked(logger.log).mockClear()
	vi.restoreAllMocks()
})

describe('useLogger', () => {
	it('logs mount with the props', () => {
		renderHook(() => useLogger('Widget', ['a', 1]))

		expect(logger.log).toHaveBeenCalledTimes(1)
		expect(logger.log).toHaveBeenCalledWith('Widget mounted', 'a', 1)
	})

	it('logs an update with the new props when they change', () => {
		const { rerender } = renderHook(({ props }) => useLogger('Widget', props), {
			initialProps: { props: ['a'] },
		})

		rerender({ props: ['b'] })

		expect(logger.log).toHaveBeenCalledTimes(2)
		expect(logger.log).toHaveBeenLastCalledWith('Widget updated', 'b')
	})

	it('does not log an update when props are unchanged', () => {
		const { rerender } = renderHook(({ props }) => useLogger('Widget', props), {
			initialProps: { props: ['a'] },
		})

		rerender({ props: ['a'] })

		expect(logger.log).toHaveBeenCalledTimes(1)
		expect(logger.log).not.toHaveBeenCalledWith('Widget updated', 'a')
	})

	it('logs unmount', () => {
		const { unmount } = renderHook(() => useLogger('Widget', []))

		unmount()

		expect(logger.log).toHaveBeenCalledTimes(2)
		expect(logger.log).toHaveBeenLastCalledWith('Widget unmounted')
	})
})
