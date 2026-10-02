import {
	Days,
	Frame,
	Header,
	Heading,
	Months,
	Next,
	Previous,
	Provider,
	Root,
	Weekdays,
	Years,
	useCalendar,
	type CalendarActions,
	type CalendarContextValue,
	type CalendarMeta,
	type CalendarState,
	type CalendarView,
	type RootProps,
	type Weekday,
} from './calendar-parts'

const Calendar = { Provider, Root, Frame, Header, Heading, Previous, Next, Weekdays, Days, Months, Years }

export { Calendar, useCalendar }
export type {
	CalendarActions,
	CalendarContextValue,
	CalendarMeta,
	CalendarState,
	CalendarView,
	RootProps as CalendarProps,
	Weekday,
}
