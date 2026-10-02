/** Fill colors, the single source for every tone map in the package. */
const fills = {
	paper: 'bg-journ-paper',
	coral: 'bg-journ-coral',
	yellow: 'bg-journ-yellow',
	indigo: 'bg-journ-indigo',
	mint: 'bg-journ-mint',
	sky: 'bg-journ-sky',
} as const

const onFill = 'text-journ-ink'

/** Fill plus readable text. */
const solidTones = {
	paper: `${fills.paper} ${onFill}`,
	coral: `${fills.coral} ${onFill}`,
	yellow: `${fills.yellow} ${onFill}`,
	indigo: `${fills.indigo} ${onFill}`,
	mint: `${fills.mint} ${onFill}`,
	sky: `${fills.sky} ${onFill}`,
} as const

/** The dark canvas color with light text, the inverse of the solid tones. */
const inkTone = 'bg-journ-ink text-journ-paper'

/** Surface tones shared by every block that paints its own background. */
const surfaceTones = {
	dark: 'bg-journ-surface text-journ-paper',
	coral: solidTones.coral,
	yellow: solidTones.yellow,
	indigo: solidTones.indigo,
	mint: solidTones.mint,
	sky: solidTones.sky,
} as const

export { fills, inkTone, solidTones, surfaceTones }
