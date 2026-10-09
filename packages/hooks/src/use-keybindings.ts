import { useEffect, useEffectEvent } from 'react'
import { keybindings, type KeyBindingMap, type KeyBindingOptions } from './lib/keybindings'

const useKeybindings = (
	keyBindingMap: KeyBindingMap,
	target?: Window | HTMLElement,
	{ event, capture, timeout }: KeyBindingOptions = {},
) => {
	const run = useEffectEvent((binding: string, keyboardEvent: KeyboardEvent) => keyBindingMap[binding]?.(keyboardEvent))
	const bindingsKey = Object.keys(keyBindingMap).join('\n')

	useEffect(() => {
		const bindings = bindingsKey === '' ? [] : bindingsKey.split('\n')
		const map: KeyBindingMap = Object.fromEntries(
			bindings.map(binding => [binding, (keyboardEvent: KeyboardEvent) => run(binding, keyboardEvent)]),
		)

		return keybindings(target ?? window, map, { event, capture, timeout })
	}, [bindingsKey, target, event, capture, timeout])
}

export { useKeybindings }
