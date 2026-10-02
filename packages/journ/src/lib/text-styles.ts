/** Display heading used by every title in the package. */
const displayTitle = 'font-journ-display text-3xl/[0.95] font-semibold uppercase'

/** Secondary text: same color at reduced opacity, never a separate gray. */
const mutedText = 'text-sm/5 opacity-70'

/** Touch-first control sizing: 16px on mobile, 14px from `sm` up. */
const controlSize = 'py-2.5 text-base/6 sm:py-1.5 sm:text-sm/6'

/** The "you are here" pill, one string per state attribute because Tailwind needs full class names. */
const selectedWhenActive = 'data-[state=active]:bg-journ-sky data-[state=active]:text-journ-ink'
const selectedWhenOn = 'data-[state=on]:bg-journ-sky data-[state=on]:text-journ-ink'
const selectedWhenCurrent = 'aria-[current=page]:bg-journ-sky aria-[current=page]:text-journ-ink'

export { controlSize, displayTitle, mutedText, selectedWhenActive, selectedWhenCurrent, selectedWhenOn }
