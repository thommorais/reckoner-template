'use client'
import { useIdleQueue } from '@thom/hooks/use-idle-queue'
import { createContext } from 'react'

const IdleQueueContext = createContext<ReturnType<typeof useIdleQueue> | null>(null)

const IdleQueueProvider = ({ children }: { children: React.ReactNode }) => {
	const queue = useIdleQueue({
		ensureTasksRun: true,
		onError: _error => {},
	})

	return <IdleQueueContext.Provider value={queue}>{children}</IdleQueueContext.Provider>
}

export { IdleQueueProvider }
