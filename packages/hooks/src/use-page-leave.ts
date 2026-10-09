import { useEffect, useEffectEvent } from 'react'

const usePageLeave = (onPageLeave: () => void) => {
	const onPageLeaveEvent = useEffectEvent(onPageLeave)

	useEffect(() => {
		document.documentElement.addEventListener('mouseleave', onPageLeaveEvent)
		return () => document.documentElement.removeEventListener('mouseleave', onPageLeaveEvent)
	}, [])
}

export { usePageLeave }
