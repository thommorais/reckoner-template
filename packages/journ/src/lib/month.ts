const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)

/** "October 2026", localized. */
const formatMonthYear = (date: Date, locale?: string) =>
	new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)

export { addMonths, formatMonthYear, startOfMonth }
