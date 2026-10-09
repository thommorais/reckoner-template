import type { KeyBindingMap, KeyBindingOptions } from './lib/keybindings'
import { keybindings } from './lib/keybindings'
import { useEffect } from 'react'

const useKeybindings = (
	keyBindingMap: KeyBindingMap,
	target: Window | HTMLElement = window,
	options: KeyBindingOptions = {},
) => {
	useEffect(() => {
		const unsub = keybindings(target, keyBindingMap, options)

		return () => unsub()
	}, [keyBindingMap, target, options])

	return
}

export { useKeybindings }
