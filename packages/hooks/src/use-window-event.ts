import { useEffect, useEffectEvent } from 'react'

type WindowEventListener<K extends string> = K extends keyof WindowEventMap
	? (event: WindowEventMap[K]) => void
	: (event: CustomEvent) => void

const useWindowEvent = <K extends string>(
	type: K,
	listener: WindowEventListener<K>,
	options?: boolean | AddEventListenerOptions,
) => {
	const onEvent = useEffectEvent((event: Event) => (listener as (event: Event) => void)(event))

	useEffect(() => {
		window.addEventListener(type, onEvent, options)
		return () => window.removeEventListener(type, onEvent, options)
	}, [type, options])
}

export { useWindowEvent }
