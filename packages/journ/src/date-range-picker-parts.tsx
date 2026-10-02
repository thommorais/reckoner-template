'use client'

import { useState, type ComponentProps, type ReactNode } from 'react'
import {
	Provider as CalendarProvider,
	useCalendarNavigation,
	type CalendarActions,
	type RootProps as CalendarRootProps,
} from './calendar-parts'
import { createPicker, type PickerActions, type PickerContextValue, type PickerState } from './lib/picker'

type DateRange = { from: Date; to: Date }
type DateRangePickerMeta = { locale?: string }
type DateRangePickerState = PickerState<DateRange>
type DateRangePickerActions = PickerActions<DateRange>
type DateRangePickerContextValue = PickerContextValue<DateRange, DateRangePickerMeta>

const {
	Provider,
	Trigger,
	Value: PickerValue,
	usePicker: useDateRangePicker,
	usePickerState,
} = createPicker<DateRange, DateRangePickerMeta>('DateRangePicker', 'date-range-picker')

type RootProps = {
	value?: DateRange | null
	defaultValue?: DateRange | null
	onValueChange?: (range: DateRange) => void
	locale?: string
	children?: ReactNode
}

const Root = ({ value, defaultValue = null, onValueChange, locale = 'en', children }: RootProps) => {
	const { state, actions } = usePickerState(value, defaultValue, onValueChange)

	return (
		<Provider state={state} actions={actions} meta={{ locale }}>
			{children}
		</Provider>
	)
}

type ValueProps = Omit<ComponentProps<typeof PickerValue>, 'children'> & {
	format?: Intl.DateTimeFormatOptions
}

const Value = ({ format = { dateStyle: 'medium' }, ...props }: ValueProps) => {
	const { state, meta } = useDateRangePicker()

	return (
		<PickerValue {...props}>
			{state.value && new Intl.DateTimeFormat(meta.locale, format).formatRange(state.value.from, state.value.to)}
		</PickerValue>
	)
}

type CalendarProps = Pick<CalendarRootProps, 'defaultMonth' | 'weekStartsOn' | 'children'>

/**
 * The first click sets one end, the second completes the range (in either
 * order) and closes the picker. A third click on a finished range starts over.
 */
const Calendar = ({ defaultMonth, weekStartsOn = 0, children }: CalendarProps) => {
	const { state, actions, meta } = useDateRangePicker()
	const [anchor, setAnchor] = useState<Date | null>(null)
	const { month, view, navigation } = useCalendarNavigation(defaultMonth ?? state.value?.from ?? new Date())

	const calendarActions: CalendarActions = {
		...navigation,
		select: date => {
			if (!anchor) return setAnchor(date)
			const [from, to] = date.getTime() < anchor.getTime() ? [date, anchor] : [anchor, date]
			setAnchor(null)
			actions.select({ from, to })
		},
	}

	return (
		<CalendarProvider
			state={{
				selected: null,
				range: anchor ? { from: anchor, to: null } : state.value,
				month,
				view,
			}}
			actions={calendarActions}
			meta={{ locale: meta.locale, weekStartsOn }}
		>
			{children}
		</CalendarProvider>
	)
}

export { Provider, Root, Trigger, Value, Calendar, useDateRangePicker }
export type {
	DateRange,
	DateRangePickerActions,
	DateRangePickerContextValue,
	DateRangePickerMeta,
	DateRangePickerState,
	RootProps,
}
