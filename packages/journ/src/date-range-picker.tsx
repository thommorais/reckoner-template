import { Calendar, Provider, Root, Trigger, Value, useDateRangePicker } from './date-range-picker-parts'
import { Content, Description, Title } from './drawer-parts'

const DateRangePicker = { Provider, Root, Trigger, Value, Content, Title, Description, Calendar }

export { DateRangePicker, useDateRangePicker }
export type {
	DateRange,
	DateRangePickerActions,
	DateRangePickerContextValue,
	DateRangePickerMeta,
	DateRangePickerState,
	RootProps as DateRangePickerProps,
} from './date-range-picker-parts'
