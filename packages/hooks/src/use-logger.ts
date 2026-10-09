import { logger } from '@thom/libs/logger'
import { useEffect, useEffectEvent } from 'react'
import { useDidUpdate } from './use-did-update'

const useLogger = (componentName: string, props: unknown[]) => {
	const logMount = useEffectEvent(() => logger.log(`${componentName} mounted`, ...props))
	const logUnmount = useEffectEvent(() => logger.log(`${componentName} unmounted`))

	useEffect(() => {
		logMount()
		return () => logUnmount()
	}, [])

	useDidUpdate(() => {
		logger.log(`${componentName} updated`, ...props)
	}, props)
}

export { useLogger }
