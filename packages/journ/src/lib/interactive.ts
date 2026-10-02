/**
 * Shared affordances for anything pressable, ported from Catalyst:
 * keyboard-only focus ring, a currentColor hover/press overlay that sits
 * between the background and the content, and a dimmed disabled state.
 */
/** Stops text selection and the iOS tap flash on controls that are pressed, not read. */
const pressReset = 'select-none [-webkit-tap-highlight-color:transparent]'

const interactive = [
	pressReset,
	'relative isolate cursor-default outline-none transition-transform duration-100 active:scale-[0.96]',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
	'after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors',
	'hover:after:bg-current/10 active:after:bg-current/15',
	'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
	'forced-colors:outline-[Highlight]',
].join(' ')

export { interactive, pressReset }
