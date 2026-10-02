/** Surface and item styles shared by floating menus (select, dropdown menu, popover). */
const floatingSurface =
	'z-50 min-w-40 rounded-2xl bg-journ-surface p-1.5 text-journ-paper shadow-lg ring-1 ring-journ-paper/10 outline-none'

const floatingItem = [
	'relative flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-base/6 outline-none select-none sm:py-1.5 sm:text-sm/6',
	'data-[highlighted]:bg-journ-paper/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
].join(' ')

const floatingLabel = 'px-3 py-1.5 font-mono text-xs opacity-60'

const floatingSeparator = 'my-1 h-px bg-current/15'

export { floatingItem, floatingLabel, floatingSeparator, floatingSurface }
