import type { ANY } from '@thom/libs/types'
import { useEffect, useMemo, useRef } from 'react'

const useCallbackRef = <T extends (...args: ANY[]) => ANY>(callback: T | undefined): T => {
	const callbackRef = useRef(callback)

	useEffect(() => {
		callbackRef.current = callback
	})

	return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

export { useCallbackRef }
