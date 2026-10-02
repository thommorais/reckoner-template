'use client'

import type { ReactNode } from 'react'
import { Root as CalendarRoot, type RootProps as CalendarRootProps } from './calendar-parts'
import { createPicker, type PickerActions, type PickerContextValue, type PickerState } from './lib/picker'

type DatePickerMeta = { locale?: string }
type DatePickerState = PickerState<Date>
type DatePickerActions = PickerActions<Date>
type DatePickerContextValue = PickerContextValue<Date, DatePickerMeta>

const {
	Provider,
	Trigger,
	Value: PickerValue,
	usePicker: useDatePicker,
	usePickerState,
} = createPicker<Date, DatePickerMeta>('DatePicker', 'date-picker')

type RootProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (date: Date) => void
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

type ValueProps = Omit<React.ComponentProps<typeof PickerValue>, 'children'> & {
	format?: Intl.DateTimeFormatOptions
}

const Value = ({ format = { dateStyle: 'medium' }, ...props }: ValueProps) => {
	const { state, meta } = useDatePicker()

	return (
		<PickerValue {...props}>
			{state.value && new Intl.DateTimeFormat(meta.locale, format).format(state.value)}
		</PickerValue>
	)
}

type CalendarProps = Omit<CalendarRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'locale'>

const Calendar = (props: CalendarProps) => {
	const { state, actions, meta } = useDatePicker()
	return <CalendarRoot {...props} value={state.value} onValueChange={actions.select} locale={meta.locale} />
}

export { Provider, Root, Trigger, Value, Calendar, useDatePicker }
export type { DatePickerActions, DatePickerContextValue, DatePickerMeta, DatePickerState, RootProps }
