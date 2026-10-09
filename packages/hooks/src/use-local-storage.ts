import { logger } from '@thom/libs/logger'
import { useCallback, useEffect, useState } from 'react'
import { useWindowEvent } from './use-window-event'

type StorageType = 'localStorage' | 'sessionStorage'

interface UseStorageOptions<T> {
	key: string
	defaultValue?: T
	getInitialValueInEffect?: boolean
	sync?: boolean
	serialize?: (value: T) => string
	deserialize?: (value: string | undefined) => T
}

const serializeJSON = <T>(value: T, hookName: string) => {
	try {
		return JSON.stringify(value)
	} catch (_) {
		throw new Error(`${hookName}: Failed to serialize the value`)
	}
}

const deserializeJSON = (value: string | undefined) => {
	try {
		return value && JSON.parse(String(value))
	} catch {
		return value
	}
}

const createStorageHandler = (type: StorageType, hookName: string) => {
	const getItem = (key: string) => {
		try {
			return window[type].getItem(key)
		} catch (_) {
			logger.warn(`${hookName}: Failed to get value from storage`)
			return null
		}
	}

	const setItem = (key: string, value: string) => {
		try {
			window[type].setItem(key, value)
		} catch (_) {
			logger.warn(`${hookName}: Failed to set value to storage`)
		}
	}

	const removeItem = (key: string) => {
		try {
			window[type].removeItem(key)
		} catch (_) {
			logger.warn(`${hookName} Failed to remove value from storage`)
		}
	}

	return { getItem, setItem, removeItem }
}

type UseStorageReturnValue<T> = [T, (val: T | ((prevState: T) => T)) => void, () => void]

const createStorage = <T>(type: StorageType, hookName: string) => {
	const eventName = type === 'localStorage' ? 'local-storage' : 'session-storage'
	const { getItem, setItem, removeItem } = createStorageHandler(type, hookName)

	const useStorage = ({
		key,
		defaultValue,
		getInitialValueInEffect = true,
		sync = true,
		deserialize = deserializeJSON,
		serialize = (value: T) => serializeJSON(value, hookName),
	}: UseStorageOptions<T>): UseStorageReturnValue<T> => {
		const readStorageValue = useCallback(
			(skipStorage?: boolean): T => {
				let storageBlockedOrSkipped

				try {
					storageBlockedOrSkipped =
						typeof window === 'undefined' || !(type in window) || window[type] === null || !!skipStorage
				} catch (_e) {
					storageBlockedOrSkipped = true
				}

				if (storageBlockedOrSkipped) {
					return defaultValue as T
				}

				const storageValue = getItem(key)
				return storageValue !== null ? deserialize(storageValue) : (defaultValue as T)
			},
			[key, defaultValue, deserialize],
		)

		const [value, setValue] = useState<T>(readStorageValue(getInitialValueInEffect))

		const setStorageValue = useCallback(
			(val: T | ((prevState: T) => T)) => {
				if (val instanceof Function) {
					setValue(current => {
						const result = val(current)
						setItem(key, serialize(result))
						queueMicrotask(() => {
							window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: result } }))
						})
						return result
					})
				} else {
					setItem(key, serialize(val))
					window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: val } }))
					setValue(val)
				}
			},
			[key, serialize],
		)

		const removeStorageValue = useCallback(() => {
			removeItem(key)
			setValue(defaultValue as T)
			window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: defaultValue } }))
		}, [key, defaultValue])

		useWindowEvent('storage', event => {
			if (sync) {
				if (event.storageArea === window[type] && event.key === key) {
					setValue(deserialize(event.newValue ?? undefined))
				}
			}
		})

		useWindowEvent(eventName, event => {
			if (sync) {
				if (event.detail.key === key) {
					setValue(event.detail.value)
				}
			}
		})

		useEffect(() => {
			if (defaultValue !== undefined && value === undefined) {
				setStorageValue(defaultValue)
			}
		}, [defaultValue, value, setStorageValue])

		useEffect(() => {
			const val = readStorageValue()
			val !== undefined && setStorageValue(val)
		}, [key, setStorageValue])

		return [value === undefined ? (defaultValue as T) : value, setStorageValue, removeStorageValue]
	}

	return useStorage
}

const useLocalStorage = <T>(props: UseStorageOptions<T>) => createStorage<T>('localStorage', 'use-local-storage')(props)
const useSessionStorage = <T>(props: UseStorageOptions<T>) =>
	createStorage<T>('localStorage', 'use-session-store')(props)

export { useLocalStorage, useSessionStorage }
