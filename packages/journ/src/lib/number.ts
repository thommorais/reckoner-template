/** Keeps `value` inside the optional bounds. */
const clamp = (value: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, value))

/** Parses typed text into a finite number, or null when it is not one. */
const parseNumber = (text: string): number | null => {
	const trimmed = text.trim().replace(',', '.')
	if (trimmed === '') return null
	const value = Number(trimmed)
	return Number.isFinite(value) ? value : null
}

export { clamp, parseNumber }
