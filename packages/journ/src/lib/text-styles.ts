/** Display heading used by every title in the package. */
const displayTitle = 'font-journ-display text-3xl/[0.95] font-semibold uppercase'

/** Small display label: stat names, alert and toast titles. */
const displayLabel = 'font-journ-display text-xl/none font-semibold uppercase'

/** Medium display heading: accordion triggers, calendar and month headings. */
const displayHeading = 'font-journ-display text-2xl/none font-semibold uppercase'

/** Secondary text: same color at reduced opacity, never a separate gray. */
const mutedText = 'text-sm/5 opacity-70'

/** Touch-first control sizing: 16px on mobile, 14px from `sm` up. */
const controlSize = 'py-2.5 text-base/6 sm:py-1.5 sm:text-sm/6'

/** Colour scheme and placeholder shared by every text field. */
const fieldText = 'scheme-dark placeholder:text-current/50'

/** Focus, invalid and disabled states shared by every text field. */
const fieldRing =
	'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky aria-invalid:outline-2 aria-invalid:outline-journ-coral disabled:opacity-50'

/** The "you are here" pill, one string per state attribute because Tailwind needs full class names. */
const selectedWhenActive = 'data-[state=active]:bg-journ-sky data-[state=active]:text-journ-ink'
const selectedWhenOn = 'data-[state=on]:bg-journ-sky data-[state=on]:text-journ-ink'
const selectedWhenCurrent = 'aria-[current=page]:bg-journ-sky aria-[current=page]:text-journ-ink'

export {
	controlSize,
	displayHeading,
	displayLabel,
	displayTitle,
	fieldRing,
	fieldText,
	mutedText,
	selectedWhenActive,
	selectedWhenCurrent,
	selectedWhenOn,
}
