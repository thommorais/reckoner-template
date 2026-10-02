import { controlSize } from './text-styles'
import { surfaceTones } from './tones'
import { tv } from './tv'

/** Surface and item styles shared by floating menus (select, dropdown menu, popover, hover card). */
const floatingSurface =
	'z-50 min-w-40 rounded-2xl bg-journ-surface p-1.5 text-journ-paper shadow-lg ring-1 ring-journ-paper/10 outline-none'

/** A floating surface that holds free-form content (popover, hover card). */
const floatingCard = `${floatingSurface} flex w-72 flex-col gap-2 p-4`

const floatingItem = [
	`relative flex cursor-default items-center gap-2 rounded-xl px-3 ${controlSize} outline-none select-none`,
	'data-[highlighted]:bg-journ-paper/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
].join(' ')

const floatingLabel = 'px-3 py-1.5 font-mono text-xs opacity-60'

const floatingSeparator = 'my-1 h-px bg-current/15'

/** Dimmed backdrop behind dialogs, alert dialogs and drawers. */
const modalOverlay = 'fixed inset-0 bg-journ-ink/60'

/** Centered panel shared by Dialog and AlertDialog. */
const centeredPanel = tv({
	base: 'rounded-journ fixed top-1/2 left-1/2 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-5 outline-none',
	variants: { tone: surfaceTones },
	defaultVariants: { tone: 'dark' },
})

export { centeredPanel, floatingCard, floatingItem, floatingLabel, floatingSeparator, floatingSurface, modalOverlay }
