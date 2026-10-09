import { logger } from '@thom/libs/logger'
import { tryCatchSync } from '@thom/try-catch'
import { isServerSide } from '@thom/utils/env'
import { useCallback, useEffect, useRef } from 'react'

type Duration = number | number[]

const supportsVibrate = (): boolean => typeof navigator !== 'undefined' && 'vibrate' in navigator

const supportsIOSSwitch = (): boolean => {
	if (typeof document === 'undefined') {
		return false
	}

	const result = tryCatchSync(() => {
		const input = document.createElement('input')
		input.setAttribute('switch', '')
		return input.getAttribute('switch') !== null
	})

	return result.success && result.data
}

const supportsHaptics: boolean = !isServerSide() && (supportsVibrate() || supportsIOSSwitch())

const logFailure = (label: string, fn: () => void): void => {
	const result = tryCatchSync(fn)
	if (!result.success) {
		logger.error(label, result.error)
	}
}

const appendHidden = <K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] => {
	const element = document.createElement(tag)
	Object.assign(element.style, { position: 'absolute', opacity: '0', pointerEvents: 'none' })
	document.body.appendChild(element)
	return element
}

const triggerIOSHaptic = (): void =>
	logFailure('Error triggering iOS haptic:', () => {
		const id = `_h${Math.random().toString(36).slice(2)}`

		const input = appendHidden('input')
		input.type = 'checkbox'
		input.id = id
		input.setAttribute('switch', '')

		const label = appendHidden('label')
		label.htmlFor = id

		label.click()

		label.remove()
		input.remove()
	})

const dispatchHaptic = (duration: Duration = 50): void => {
	if (supportsVibrate()) {
		navigator.vibrate(duration)
		return
	}

	if (Array.isArray(duration)) {
		for (const d of duration) {
			setTimeout(triggerIOSHaptic, Math.max(d, 101))
		}
		return
	}

	triggerIOSHaptic()
}

const useHaptic = (): ((duration?: Duration) => void) => dispatchHaptic

const useHapticsError = () => {
	const triggerHaptic = useHaptic()
	const timerIds = useRef<ReturnType<typeof setTimeout>[]>([])

	useEffect(
		() => () => {
			for (const id of timerIds.current) {
				clearTimeout(id)
			}
			timerIds.current = []
		},
		[],
	)

	return useCallback(
		() =>
			logFailure('Error triggering error haptic:', () => {
				if (supportsVibrate()) {
					triggerHaptic([40, 60, 40, 60, 40, 60, 40])
					return
				}

				triggerHaptic()
				timerIds.current.push(
					setTimeout(() => triggerHaptic(), 100),
					setTimeout(() => triggerHaptic(), 200),
					setTimeout(() => triggerHaptic(), 300),
				)
			}),
		[triggerHaptic],
	)
}

const useHapticsConfirm = () => {
	const triggerHaptic = useHaptic()

	return useCallback(() => logFailure('Error triggering confirm haptic:', () => triggerHaptic([100])), [triggerHaptic])
}

export { useHaptic, useHapticsConfirm, useHapticsError, supportsHaptics }
