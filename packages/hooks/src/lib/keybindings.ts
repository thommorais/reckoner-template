type KeyBindingPress = [mods: string[], key: string | RegExp]

type KeyBindingMap = Record<string, (event: KeyboardEvent) => void>

type KeyBindingHandlerOptions = {
	timeout?: number
}

type KeyBindingOptions = KeyBindingHandlerOptions & {
	event?: 'keydown' | 'keyup'
	capture?: boolean
}

const KEYBINDING_MODIFIER_KEYS = ['Shift', 'Meta', 'Alt', 'Control']

const DEFAULT_TIMEOUT = 1000

const DEFAULT_EVENT = 'keydown' as const

const PLATFORM = typeof navigator === 'object' ? navigator.platform : ''
const APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM)

const MOD = APPLE_DEVICE ? 'Meta' : 'Control'

const ALT_GRAPH_ALIASES = PLATFORM === 'Win32' ? ['Control', 'Alt'] : APPLE_DEVICE ? ['Alt'] : []

const getModifierState = (event: KeyboardEvent, mod: string): boolean =>
	typeof event.getModifierState === 'function'
		? event.getModifierState(mod) || (ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState('AltGraph'))
		: false

const parseKeybinding = (str: string): KeyBindingPress[] =>
	str
		.trim()
		.split(' ')
		.map((press): KeyBindingPress => {
			const parts = press.split(/\b\+/)
			const rawKey = parts.at(-1) as string
			const mods = parts.slice(0, -1).map(mod => (mod === '$mod' ? MOD : mod))
			const match = rawKey.match(/^\((.+)\)$/)

			return [mods, match ? new RegExp(`^${match[1]}$`) : rawKey]
		})

const matchesKey = (event: KeyboardEvent, key: string | RegExp): boolean =>
	key instanceof RegExp
		? key.test(event.key) || key.test(event.code)
		: key.toUpperCase() === event.key.toUpperCase() || key === event.code

const hasRequiredModifiers = (event: KeyboardEvent, mods: string[]): boolean =>
	mods.every(mod => getModifierState(event, mod))

const hasExtraModifiers = (event: KeyboardEvent, mods: string[], key: string | RegExp): boolean =>
	KEYBINDING_MODIFIER_KEYS.some(mod => !mods.includes(mod) && key !== mod && getModifierState(event, mod))

const matchKeyBindingPress = (event: KeyboardEvent, [mods, key]: KeyBindingPress): boolean =>
	matchesKey(event, key) && hasRequiredModifiers(event, mods) && !hasExtraModifiers(event, mods, key)

const createKeybindingsHandler = (
	keyBindingMap: KeyBindingMap,
	{ timeout = DEFAULT_TIMEOUT }: KeyBindingHandlerOptions = {},
): EventListener => {
	const keyBindings = Object.entries(keyBindingMap).map(
		([binding, callback]) => [parseKeybinding(binding), callback] as const,
	)

	const possibleMatches = new Map<KeyBindingPress[], KeyBindingPress[]>()
	let timer: ReturnType<typeof setTimeout> | null = null

	return event => {
		if (!(event instanceof KeyboardEvent)) {
			return
		}

		for (const [sequence, callback] of keyBindings) {
			const remainingExpectedPresses = possibleMatches.get(sequence) ?? sequence
			const currentExpectedPress = remainingExpectedPresses[0]

			if (!currentExpectedPress) {
				continue
			}

			if (!matchKeyBindingPress(event, currentExpectedPress)) {
				if (!getModifierState(event, event.key)) {
					possibleMatches.delete(sequence)
				}
			} else if (remainingExpectedPresses.length > 1) {
				possibleMatches.set(sequence, remainingExpectedPresses.slice(1))
			} else {
				possibleMatches.delete(sequence)
				callback(event)
			}
		}

		if (timer) {
			clearTimeout(timer)
		}

		timer = setTimeout(() => possibleMatches.clear(), timeout)
	}
}

const keybindings = (
	target: Window | HTMLElement,
	keyBindingMap: KeyBindingMap,
	{ event = DEFAULT_EVENT, capture, timeout }: KeyBindingOptions = {},
): (() => void) => {
	const onKeyEvent = createKeybindingsHandler(keyBindingMap, { timeout })
	target.addEventListener(event, onKeyEvent, capture)

	return () => target.removeEventListener(event, onKeyEvent, capture)
}

export { keybindings }

export type { KeyBindingMap, KeyBindingOptions, KeyBindingPress }
