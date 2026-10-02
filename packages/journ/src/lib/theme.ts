/**
 * Every light and dark pairing in the package lives here, written with
 * Tailwind's `dark:` variant. Components import these instead of repeating
 * the pairs. Roles: canvas (page), surface (raised blocks), foreground (text),
 * accent (text accent on a surface).
 */

/** Readable text on the canvas and on surfaces. */
const foreground = 'text-journ-foreground dark:text-journ-foreground-dark'

/** The page background with its text and native control scheme. */
const canvas = `bg-journ-canvas scheme-light dark:bg-journ-canvas-dark dark:scheme-dark ${foreground}`

/** A raised block's fill and text, no edge. */
const surfaceFill = `bg-journ-surface dark:bg-journ-surface-dark ${foreground}`

/** Cards: a faint edge in light, none in dark where the fill already separates. */
const surface = `${surfaceFill} ring-1 ring-journ-foreground/5 dark:ring-0`

/** Floating blocks that need an edge in both themes: menus, toasts, the nav bar. */
const raised = `${surfaceFill} ring-1 ring-journ-foreground/10 dark:ring-journ-foreground-dark/10`

const faintBorder = 'border-journ-foreground/10 dark:border-journ-foreground-dark/10'

/** A dim layer over a surface: inputs, bubbles, hover states. */
const dim = 'bg-journ-foreground/10 dark:bg-journ-foreground-dark/10'

/** The handle of a drawer and other low-key marks. */
const mutedFill = 'bg-journ-foreground/30 dark:bg-journ-foreground-dark/30'

/** A solid fill that inverts with the theme, for neutral buttons and thumbs. */
const neutralFill = 'bg-journ-foreground dark:bg-journ-foreground-dark'
const neutralText = 'text-journ-canvas dark:text-journ-canvas-dark'
const neutral = `${neutralFill} ${neutralText}`

/** Text on a form control that opens something. */
const controlText = 'text-journ-foreground dark:text-journ-ink'

/** Selects and pickers read as light fields in both themes, never as buttons. */
const control = `bg-journ-surface ${controlText} ring-1 ring-journ-foreground/15 dark:bg-journ-paper dark:ring-0`

/** A gradient of the text color that the shimmer animation slides across the letters. */
const shimmer =
	'bg-linear-to-r from-journ-foreground/40 via-journ-foreground to-journ-foreground/40 dark:from-journ-foreground-dark/40 dark:via-journ-foreground-dark dark:to-journ-foreground-dark/40'

const accentText = 'text-journ-accent dark:text-journ-accent-dark'

export {
	accentText,
	canvas,
	control,
	controlText,
	dim,
	faintBorder,
	foreground,
	mutedFill,
	neutral,
	neutralFill,
	neutralText,
	raised,
	shimmer,
	surface,
	surfaceFill,
}
