import {
	Calendar,
	Provider,
	Root,
	Trigger,
	Value,
	useDatePicker,
	type DatePickerActions,
	type DatePickerContextValue,
	type DatePickerMeta,
	type DatePickerState,
	type RootProps,
} from './date-picker-parts'
import { Content, Description, Title } from './drawer-parts'

const DatePicker = { Provider, Root, Trigger, Value, Content, Title, Description, Calendar }

export { DatePicker, useDatePicker }
export type { DatePickerActions, DatePickerContextValue, DatePickerMeta, DatePickerState, RootProps as DatePickerProps }
