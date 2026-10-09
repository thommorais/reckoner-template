import { logger } from '@thom/libs/logger'
import { tryCatchSync } from '@thom/try-catch'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

type StorageType = 'localStorage' | 'sessionStorage'

type UseStorageOptions<T> = {
	key: string
	defaultValue?: T
	serialize?: (value: T) => string
	deserialize?: (value: string) => T
}

type UseStorageReturnValue<T> = [T, (val: T | ((prevState: T) => T)) => void, () => void]

const serializeJSON = <T>(value: T, hookName: string) => {
	const result = tryCatchSync(() => JSON.stringify(value))
	if (!result.success) {
		throw new Error(`${hookName}: Failed to serialize the value`)
	}
	return result.data
}

const deserializeJSON = (value: string) => {
	const result = tryCatchSync(() => JSON.parse(value))
	return result.success ? result.data : value
}

const createStorageHandler = (type: StorageType, hookName: string) => {
	const attempt = <R>(fn: () => R, failure: string, fallback: R): R => {
		const result = tryCatchSync(fn)
		if (result.success) {
			return result.data
		}
		logger.warn(`${hookName}: ${failure}`)
		return fallback
	}

	const getItem = (key: string) => attempt(() => window[type].getItem(key), 'Failed to get value from storage', null)

	const setItem = (key: string, value: string) =>
		attempt(() => window[type].setItem(key, value), 'Failed to set value to storage', undefined)

	const removeItem = (key: string) =>
		attempt(() => window[type].removeItem(key), 'Failed to remove value from storage', undefined)

	return { getItem, setItem, removeItem }
}

const getServerSnapshot = () => null

const createUseStorage = (type: StorageType, hookName: string) => {
	const eventName = type === 'localStorage' ? 'local-storage' : 'session-storage'
	const { getItem, setItem, removeItem } = createStorageHandler(type, hookName)

	const subscribe = (callback: () => void) => {
		window.addEventListener('storage', callback)
		window.addEventListener(eventName, callback)
		return () => {
			window.removeEventListener('storage', callback)
			window.removeEventListener(eventName, callback)
		}
	}

	const defaultSerialize = (value: unknown) => serializeJSON(value, hookName)

	const notify = () => window.dispatchEvent(new Event(eventName))

	return <T>({
		key,
		defaultValue,
		deserialize = deserializeJSON,
		serialize = defaultSerialize,
	}: UseStorageOptions<T>): UseStorageReturnValue<T> => {
		const getSnapshot = useCallback(() => getItem(key), [key])
		const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

		const stored = useMemo(() => (raw === null ? undefined : deserialize(raw)), [raw, deserialize])

		const setStorageValue = useCallback(
			(val: T | ((prevState: T) => T)) => {
				let next: T
				if (val instanceof Function) {
					const current = getItem(key)
					next = val(current === null ? (defaultValue as T) : deserialize(current))
				} else {
					next = val
				}
				setItem(key, serialize(next))
				notify()
			},
			[key, defaultValue, deserialize, serialize],
		)

		const removeStorageValue = useCallback(() => {
			removeItem(key)
			notify()
		}, [key])

		return [raw === null ? (defaultValue as T) : (stored as T), setStorageValue, removeStorageValue]
	}
}

const useLocalStorage = createUseStorage('localStorage', 'use-local-storage')
const useSessionStorage = createUseStorage('sessionStorage', 'use-session-storage')

export { useLocalStorage, useSessionStorage }
