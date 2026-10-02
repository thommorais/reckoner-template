/** Keeps `value` inside the optional bounds. */
const clamp = (value: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, value))

/** Parses typed text into a finite number, or null when it is not one. */
const parseNumber = (text: string): number | null => {
	const trimmed = text.trim().replace(',', '.')
	if (trimmed === '') return null
	const value = Number(trimmed)
	return Number.isFinite(value) ? value : null
}

/** The decimal and group separators a locale uses, e.g. `.` and `,` for en. */
const separators = (locale: string) => {
	const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
	return {
		decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
		group: parts.find(part => part.type === 'group')?.value ?? ',',
	}
}

/**
 * Reads an amount the way a person types it: currency symbols and spaces are
 * ignored, the locale's separators are honoured, and a lone separator with
 * other than three digits after it counts as the decimal point ("12.5" in
 * pt-BR is 12.5, not 125). Returns null when there is no number.
 */
const parseLocalizedNumber = (text: string, locale = 'en'): number | null => {
	const { decimal, group } = separators(locale)
	const clean = text.replace(/[^\d.,-]/g, '')
	if (!/\d/.test(clean)) return null

	const other = decimal === '.' ? ',' : '.'
	const hasDecimal = clean.includes(decimal)
	const lone = !hasDecimal && clean.split(other).length === 2 && clean.split(other)[1]!.length !== 3
	const decimalChar = hasDecimal ? decimal : lone ? other : null

	const normalized = decimalChar
		? clean
				.split(decimalChar)
				.map(part => part.replace(/[.,]/g, ''))
				.join('.')
		: clean.replace(new RegExp(`[${group === '.' ? '\\.' : group}.,]`, 'g'), '')
	const value = Number(normalized)
	return Number.isFinite(value) ? value : null
}

/** An editable number with the locale's decimal separator and no grouping. */
const formatPlain = (value: number, locale = 'en') =>
	new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(value)

export { clamp, formatPlain, parseLocalizedNumber, parseNumber }
