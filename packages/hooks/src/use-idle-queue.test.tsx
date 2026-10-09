import { createIdleQueue } from '@thom/idle-queue'
import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIdleQueue } from './use-idle-queue'

vi.mock('@thom/idle-queue', () => ({ createIdleQueue: vi.fn() }))

type FakeQueue = {
	pushTask: ReturnType<typeof vi.fn>
	unshiftTask: ReturnType<typeof vi.fn>
	runTasksImmediately: ReturnType<typeof vi.fn>
	hasPendingTasks: ReturnType<typeof vi.fn>
	clearPendingTasks: ReturnType<typeof vi.fn>
	getState: ReturnType<typeof vi.fn>
	destroy: ReturnType<typeof vi.fn>
}

const queues: FakeQueue[] = []
const taskState = {} as never

const makeQueue = (): FakeQueue => ({
	pushTask: vi.fn(),
	unshiftTask: vi.fn(),
	runTasksImmediately: vi.fn(),
	hasPendingTasks: vi.fn(() => true),
	clearPendingTasks: vi.fn(),
	getState: vi.fn(() => 'state'),
	destroy: vi.fn(),
})

const mockedCreate = vi.mocked(createIdleQueue)
const lastQueue = () => queues.at(-1) as FakeQueue
const lastOptions = () => mockedCreate.mock.calls.at(-1)?.[0]

beforeEach(() => {
	queues.length = 0
	mockedCreate.mockReset()
	mockedCreate.mockImplementation(() => {
		const queue = makeQueue()
		queues.push(queue)
		return queue as unknown as ReturnType<typeof createIdleQueue>
	})
})

afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('useIdleQueue', () => {
	it('creates a queue with ensureTasksRun true and minTaskTime 0 by default', () => {
		renderHook(() => useIdleQueue())

		expect(mockedCreate).toHaveBeenCalledTimes(1)
		expect(lastOptions()).toMatchObject({ ensureTasksRun: true, minTaskTime: 0 })
	})

	it('passes explicit options to the queue', () => {
		renderHook(() => useIdleQueue({ ensureTasksRun: false, minTaskTime: 25 }))

		expect(lastOptions()).toMatchObject({ ensureTasksRun: false, minTaskTime: 25 })
	})

	it('does not recreate the queue on rerender with the same options', () => {
		const { rerender } = renderHook(() => useIdleQueue({ minTaskTime: 5 }))

		rerender()

		expect(mockedCreate).toHaveBeenCalledTimes(1)
	})

	it('recreates the queue and destroys the old one when ensureTasksRun changes', () => {
		const { rerender } = renderHook(({ ensureTasksRun }) => useIdleQueue({ ensureTasksRun }), {
			initialProps: { ensureTasksRun: true },
		})
		const first = lastQueue()

		rerender({ ensureTasksRun: false })

		expect(first.destroy).toHaveBeenCalledTimes(1)
		expect(mockedCreate).toHaveBeenCalledTimes(2)
		expect(lastOptions()).toMatchObject({ ensureTasksRun: false })
	})

	it('recreates the queue when minTaskTime changes', () => {
		const { rerender } = renderHook(({ minTaskTime }) => useIdleQueue({ minTaskTime }), {
			initialProps: { minTaskTime: 0 },
		})
		const first = lastQueue()

		rerender({ minTaskTime: 10 })

		expect(first.destroy).toHaveBeenCalledTimes(1)
		expect(mockedCreate).toHaveBeenCalledTimes(2)
		expect(lastOptions()).toMatchObject({ minTaskTime: 10 })
	})

	it('destroys the queue on unmount', () => {
		const { unmount } = renderHook(() => useIdleQueue())

		unmount()

		expect(lastQueue().destroy).toHaveBeenCalledTimes(1)
	})

	it('delegates pushTask with its arguments', () => {
		const { result } = renderHook(() => useIdleQueue())
		const task = vi.fn()

		result.current.pushTask(task, { minTaskTime: 3 } as never)

		expect(lastQueue().pushTask).toHaveBeenCalledWith(task, { minTaskTime: 3 })
	})

	it('delegates unshiftTask with its arguments', () => {
		const { result } = renderHook(() => useIdleQueue())
		const task = vi.fn()

		result.current.unshiftTask(task, { minTaskTime: 3 } as never)

		expect(lastQueue().unshiftTask).toHaveBeenCalledWith(task, { minTaskTime: 3 })
	})

	it('delegates runTasksImmediately and clearPendingTasks', () => {
		const { result } = renderHook(() => useIdleQueue())

		result.current.runTasksImmediately()
		result.current.clearPendingTasks()

		expect(lastQueue().runTasksImmediately).toHaveBeenCalledTimes(1)
		expect(lastQueue().clearPendingTasks).toHaveBeenCalledTimes(1)
	})

	it('delegates hasPendingTasks and getState return values', () => {
		const { result } = renderHook(() => useIdleQueue())

		expect(result.current.hasPendingTasks()).toBe(true)
		expect(result.current.getState()).toBe('state')
	})

	it('returns false and null for hasPendingTasks and getState after unmount', () => {
		const { result, unmount } = renderHook(() => useIdleQueue())

		unmount()

		expect(result.current.hasPendingTasks()).toBe(false)
		expect(result.current.getState()).toBeNull()
	})

	it('does not throw when pushing after unmount', () => {
		const { result, unmount } = renderHook(() => useIdleQueue())
		const queue = lastQueue()

		unmount()

		expect(() => result.current.pushTask(vi.fn())).not.toThrow()
		expect(queue.pushTask).not.toHaveBeenCalled()
	})

	it('delegates to the new queue after options change', () => {
		const { result, rerender } = renderHook(({ minTaskTime }) => useIdleQueue({ minTaskTime }), {
			initialProps: { minTaskTime: 0 },
		})
		const first = lastQueue()

		rerender({ minTaskTime: 1 })
		result.current.runTasksImmediately()

		expect(first.runTasksImmediately).not.toHaveBeenCalled()
		expect(lastQueue().runTasksImmediately).toHaveBeenCalledTimes(1)
	})

	it('returns a stable object across rerenders and option changes', () => {
		const { result, rerender } = renderHook(({ minTaskTime }) => useIdleQueue({ minTaskTime }), {
			initialProps: { minTaskTime: 0 },
		})
		const first = result.current

		rerender({ minTaskTime: 0 })
		rerender({ minTaskTime: 9 })

		expect(result.current).toBe(first)
	})

	it('forwards queue errors to onError', () => {
		const onError = vi.fn()
		renderHook(() => useIdleQueue({ onError }))
		const error = new Error('boom')

		lastOptions()?.onError?.(error, taskState)

		expect(onError).toHaveBeenCalledWith(error)
	})

	it('does not throw when a queue error occurs without onError', () => {
		renderHook(() => useIdleQueue())

		expect(() => lastOptions()?.onError?.(new Error('boom'), taskState)).not.toThrow()
	})

	it('calls the latest onError without recreating the queue', () => {
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = renderHook(({ onError }) => useIdleQueue({ onError }), {
			initialProps: { onError: first },
		})
		const forwarded = lastOptions()?.onError
		const error = new Error('boom')

		rerender({ onError: second })
		forwarded?.(error, taskState)

		expect(mockedCreate).toHaveBeenCalledTimes(1)
		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledWith(error)
	})
})
