import { registerServiceWorker } from '_/app/register-sw'
import { Toast } from 'journ/toast'
import { useEffect, useEffectEvent } from 'react'
import { useIntlayer } from 'react-intlayer'

// registerType is 'prompt', so a new worker waits rather than taking over
// mid-session: reloading under someone filling a form would lose it.
const ReloadPrompt = () => {
	const { message, action } = useIntlayer('reload-prompt')

	const announce = useEffectEvent((update: () => Promise<void>) => {
		Toast.show(message.value, {
			duration: Number.POSITIVE_INFINITY,
			action: {
				label: action.value,
				onClick: () => {
					void update()
				},
			},
		})
	})

	useEffect(() => {
		registerServiceWorker(({ update }) => announce(update))
	}, [])

	return null
}

export { ReloadPrompt }
