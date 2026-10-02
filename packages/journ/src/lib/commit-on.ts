import type { FocusEvent, FocusEventHandler, KeyboardEvent, KeyboardEventHandler } from 'react'

/**
 * Handlers that commit typed text on blur and on Enter, after the caller's own
 * handlers have run. Spread them on a text field.
 */
const commitOn = <T extends HTMLElement>(
	commit: () => void,
	{ onBlur, onKeyDown }: { onBlur?: FocusEventHandler<T>; onKeyDown?: KeyboardEventHandler<T> } = {},
) => ({
	onBlur: (event: FocusEvent<T>) => {
		onBlur?.(event)
		commit()
	},
	onKeyDown: (event: KeyboardEvent<T>) => {
		onKeyDown?.(event)
		if (event.key === 'Enter') commit()
	},
})

export { commitOn }
