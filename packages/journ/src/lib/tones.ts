import { canvas, neutral, neutralFill, surface } from './theme'

/** Fill colors, the single source for every tone map in the package. */
const fills = {
	/** Inverts with the theme: a dark fill in light mode, a light fill in dark mode. */
	neutral: neutralFill,
	coral: 'bg-journ-coral',
	yellow: 'bg-journ-yellow',
	indigo: 'bg-journ-indigo',
	mint: 'bg-journ-mint',
	sky: 'bg-journ-sky',
} as const

const onFill = 'text-journ-ink'

/** Fill plus readable text. */
const solidTones = {
	neutral,
	coral: `${fills.coral} ${onFill}`,
	yellow: `${fills.yellow} ${onFill}`,
	indigo: `${fills.indigo} ${onFill}`,
	mint: `${fills.mint} ${onFill}`,
	sky: `${fills.sky} ${onFill}`,
} as const

/** The dark canvas color with light text, the inverse of the solid tones. */
const inkTone = 'bg-journ-ink text-journ-paper'

/** The page background and its readable text. Follows the theme. */
const canvasTone = canvas

/** Surface tones shared by every block that paints its own background. */
const surfaceTones = {
	surface,
	coral: solidTones.coral,
	yellow: solidTones.yellow,
	indigo: solidTones.indigo,
	mint: solidTones.mint,
	sky: solidTones.sky,
} as const

export { canvasTone, fills, inkTone, solidTones, surfaceTones }
