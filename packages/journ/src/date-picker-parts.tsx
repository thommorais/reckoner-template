'use client'

import { createContext, use, useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Button, type ButtonProps } from './button'
import { Root as CalendarRoot, type RootProps as CalendarRootProps } from './calendar-parts'
import { Root as DrawerRoot, Trigger as DrawerTrigger } from './drawer-parts'
import { cn } from './lib/cn'
import { useControllableState } from './lib/use-controllable-state'

type DatePickerState = {
	value: Date | null
	open: boolean
}

type DatePickerActions = {
	select: (date: Date) => void
	setOpen: (open: boolean) => void
}

type DatePickerMeta = {
	locale?: string
}

type DatePickerContextValue = {
	state: DatePickerState
	actions: DatePickerActions
	meta: DatePickerMeta
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null)

const useDatePicker = (): DatePickerContextValue => {
	const context = use(DatePickerContext)
	if (!context) throw new Error('DatePicker parts must be rendered inside DatePicker.Provider or DatePicker.Root')
	return context
}

type ProviderProps = DatePickerContextValue & { children?: ReactNode }

const Provider = ({ state, actions, meta, children }: ProviderProps) => (
	<DatePickerContext value={{ state, actions, meta }}>
		<DrawerRoot open={state.open} onOpenChange={actions.setOpen}>
			{children}
		</DrawerRoot>
	</DatePickerContext>
)

type RootProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (date: Date) => void
	locale?: string
	children?: ReactNode
}

const Root = ({ value, defaultValue = null, onValueChange, locale, children }: RootProps) => {
	const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
	const [open, setOpen] = useState(false)

	const actions: DatePickerActions = {
		select: date => {
			setCurrent(date)
			setOpen(false)
		},
		setOpen,
	}

	return (
		<Provider state={{ value: current, open }} actions={actions} meta={{ locale }}>
			{children}
		</Provider>
	)
}

type TriggerProps = ComponentPropsWithRef<'button'> & {
	tone?: ButtonProps['tone']
}

const Trigger = ({ tone = 'paper', className, ...props }: TriggerProps) => (
	<DrawerTrigger asChild>
		<Button data-slot='date-picker-trigger' tone={tone} {...props} className={cn('justify-start', className)} />
	</DrawerTrigger>
)

type ValueProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
	placeholder?: string
	format?: Intl.DateTimeFormatOptions
}

const Value = ({ placeholder, format = { dateStyle: 'medium' }, className, ...props }: ValueProps) => {
	const { state, meta } = useDatePicker()

	return (
		<span
			data-slot='date-picker-value'
			data-placeholder={state.value === null}
			{...props}
			className={cn('truncate data-[placeholder=true]:opacity-70', className)}
		>
			{state.value === null ? placeholder : new Intl.DateTimeFormat(meta.locale, format).format(state.value)}
		</span>
	)
}

type CalendarProps = Omit<CalendarRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'locale'>

const Calendar = (props: CalendarProps) => {
	const { state, actions, meta } = useDatePicker()
	return <CalendarRoot {...props} value={state.value} onValueChange={actions.select} locale={meta.locale} />
}

export { Provider, Root, Trigger, Value, Calendar, useDatePicker }
export type { DatePickerActions, DatePickerContextValue, DatePickerMeta, DatePickerState, RootProps }
