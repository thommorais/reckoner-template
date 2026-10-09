import { createIdleQueue, type IdleQueue, type Task, type TaskOptions } from '@thom/idle-queue'
import { useEffect, useEffectEvent, useMemo, useRef } from 'react'

type UseIdleQueueOptions = {
	ensureTasksRun?: boolean
	minTaskTime?: number
	onError?: (error: unknown) => void
}

const useIdleQueue = ({ ensureTasksRun = true, minTaskTime = 0, onError }: UseIdleQueueOptions = {}) => {
	const queueRef = useRef<IdleQueue | null>(null)
	const reportError = useEffectEvent((error: unknown) => onError?.(error))

	useEffect(() => {
		const queue = createIdleQueue({ ensureTasksRun, minTaskTime, onError: reportError })
		queueRef.current = queue

		return () => {
			queue.destroy()
			queueRef.current = null
		}
	}, [ensureTasksRun, minTaskTime])

	return useMemo(
		() => ({
			pushTask: (task: Task, options?: TaskOptions) => queueRef.current?.pushTask(task, options),
			unshiftTask: (task: Task, options?: TaskOptions) => queueRef.current?.unshiftTask(task, options),
			runTasksImmediately: () => queueRef.current?.runTasksImmediately(),
			hasPendingTasks: () => queueRef.current?.hasPendingTasks() ?? false,
			clearPendingTasks: () => queueRef.current?.clearPendingTasks(),
			getState: () => queueRef.current?.getState() ?? null,
		}),
		[],
	)
}

export { useIdleQueue }
