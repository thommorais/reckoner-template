import type { ANY } from '@thom/libs/types'
import { useEffect, useMemo } from 'react'
import { useCallbackRef } from './use-callback-ref'

type UseDebouncedCallbackOptions = {
	delay: number
	flushOnUnmount?: boolean
	leading?: boolean
	maxWait?: number
}

type UseDebouncedCallbackReturnValue<T extends (...args: ANY[]) => ANY> = ((...args: Parameters<T>) => void) & {
	flush: () => void
	cancel: () => void
	isPending: () => boolean
}

type DebounceConfig = Pick<UseDebouncedCallbackOptions, 'delay' | 'leading' | 'maxWait'>

const createDebounced = <A extends unknown[]>(
	run: (...args: A) => void,
	{ delay, leading, maxWait }: DebounceConfig,
) => {
	let debounceTimer: number | undefined
	let maxWaitTimer: number | undefined
	let latestArgs: A | undefined
	let isFirstCall = true
	let pending = false

	const cancel = () => {
		window.clearTimeout(debounceTimer)
		window.clearTimeout(maxWaitTimer)
		debounceTimer = undefined
		maxWaitTimer = undefined
		isFirstCall = true
		pending = false
	}

	const flush = () => {
		if (pending && debounceTimer !== undefined && latestArgs) {
			const args = latestArgs
			cancel()
			run(...args)
		}
	}

	const startMaxWait = () => {
		if (maxWait !== undefined && maxWaitTimer === undefined) {
			maxWaitTimer = window.setTimeout(flush, maxWait)
		}
	}

	const debounced = (...args: A) => {
		window.clearTimeout(debounceTimer)
		latestArgs = args

		const isLeadingCall = leading && isFirstCall
		isFirstCall = false

		if (isLeadingCall) {
			run(...args)
			debounceTimer = window.setTimeout(cancel, delay)
		} else {
			pending = true
			debounceTimer = window.setTimeout(leading ? cancel : flush, delay)
		}

		startMaxWait()
	}

	return Object.assign(debounced, { flush, cancel, isPending: () => pending })
}

const useDebouncedCallback = <T extends (...args: ANY[]) => ANY>(
	callback: T,
	options: number | UseDebouncedCallbackOptions,
): UseDebouncedCallbackReturnValue<T> => {
	const config: UseDebouncedCallbackOptions = typeof options === 'number' ? { delay: options } : options
	const { delay, flushOnUnmount = false, leading = false, maxWait } = config

	const handleCallback = useCallbackRef(callback)

	const debounced = useMemo(
		() => createDebounced<Parameters<T>>(handleCallback, { delay, leading, maxWait }),
		[handleCallback, delay, leading, maxWait],
	)

	useEffect(
		() => () => {
			if (flushOnUnmount) {
				debounced.flush()
			} else {
				debounced.cancel()
			}
		},
		[debounced, flushOnUnmount],
	)

	return debounced
}

export { useDebouncedCallback }

export type { UseDebouncedCallbackOptions, UseDebouncedCallbackReturnValue }
