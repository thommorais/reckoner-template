'use client'

import type { ReactNode } from 'react'
import { Provider as CalendarProvider, useCalendarNavigation, type CalendarActions } from './calendar-parts'
import { startOfMonth } from './lib/month'
import { useControllableState } from './lib/use-controllable-state'

type RootProps = {
	/** Any day in the selected month. Reported back as the first of the month. */
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (month: Date) => void
	/** The year shown first. Defaults to the selected month's year. */
	defaultMonth?: Date
	locale?: string
	children?: ReactNode
}

/**
 * A calendar that stops at months: it reuses the Calendar parts (Frame, Header,
 * Heading, Previous, Next, Months, Years) and never shows days.
 */
const Root = ({ value, defaultValue = null, onValueChange, defaultMonth, locale = 'en', children }: RootProps) => {
	const [selected, setSelected] = useControllableState(
		value ? startOfMonth(value) : value,
		defaultValue && startOfMonth(defaultValue),
		onValueChange,
	)
	const { month, view, navigation } = useCalendarNavigation(defaultMonth ?? selected ?? new Date(), 'months')

	const actions: CalendarActions = {
		...navigation,
		select: () => undefined,
		showView: next => navigation.showView(next === 'days' ? 'months' : next),
		showMonth: next => {
			if (view === 'months') setSelected(startOfMonth(next))
			navigation.showMonth(next)
		},
	}

	return (
		<CalendarProvider state={{ selected, month, view }} actions={actions} meta={{ locale, weekStartsOn: 0 }}>
			{children}
		</CalendarProvider>
	)
}

export { Root }
export type { RootProps }
