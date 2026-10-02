type Order = readonly ['day' | 'month' | 'year', 'day' | 'month' | 'year', 'day' | 'month' | 'year']

/** Field order of a locale's short numeric date, e.g. month, day, year for `en`. */
const dateOrder = (locale: string): Order => {
	const parts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(
		new Date(2001, 10, 22),
	)
	return parts.flatMap(part =>
		part.type === 'day' || part.type === 'month' || part.type === 'year' ? [part.type] : [],
	) as unknown as Order
}

/** Placeholder such as `mm/dd/yyyy`, built from the locale's order and separator. */
const datePlaceholder = (locale: string): string => {
	const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
	const labels = { day: 'dd', month: 'mm', year: 'yyyy' } as const
	return formatter
		.formatToParts(new Date(2001, 10, 22))
		.map(part =>
			part.type === 'day' || part.type === 'month' || part.type === 'year' ? labels[part.type] : part.value,
		)
		.join('')
}

const build = (year: number, month: number, day: number): Date | null => {
	const date = new Date(year, month - 1, day)
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

/**
 * Accepts what people type: ISO (2024-01-15), or three numbers separated by
 * `/`, `-`, `.` or spaces in the locale's order. Two digit years mean 20xx.
 * Returns null when it is not a real calendar date.
 */
const parseDate = (text: string, locale = 'en'): Date | null => {
	const input = text.trim()
	if (!input) return null

	const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(input)
	if (iso) return build(Number(iso[1]), Number(iso[2]), Number(iso[3]))

	const match = /^(\d{1,4})[\s/.-]+(\d{1,2})[\s/.-]+(\d{1,4})$/.exec(input)
	if (!match) return null

	const order = dateOrder(locale)
	const values = { [order[0]]: Number(match[1]), [order[1]]: Number(match[2]), [order[2]]: Number(match[3]) } as Record<
		'day' | 'month' | 'year',
		number
	>
	const year = values.year < 100 ? 2000 + values.year : values.year
	return build(year, values.month, values.day)
}

const formatDate = (date: Date, locale = 'en'): string =>
	new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)

export { dateOrder, datePlaceholder, formatDate, parseDate }
