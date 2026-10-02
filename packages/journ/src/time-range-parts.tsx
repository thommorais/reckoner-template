'use client'

import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Input } from './input'
import { cn } from './lib/cn'
import { createRequiredContext } from './lib/required-context'
import { mutedText } from './lib/text-styles'
import { formatDuration, minutesBetween } from './lib/time'
import { useControllableState } from './lib/use-controllable-state'

type TimeRangeValue = { start: string; stop: string }

type TimeRangeContextValue = {
	value: TimeRangeValue
	change: (next: Partial<TimeRangeValue>) => void
}

const [TimeRangeContext, useTimeRange] = createRequiredContext<TimeRangeContextValue>('TimeRange.Root')

type RootProps = {
	/** Times as "HH:mm". Empty strings while unset. */
	value?: TimeRangeValue
	defaultValue?: TimeRangeValue
	onValueChange?: (value: TimeRangeValue) => void
	children?: ReactNode
}

const empty: TimeRangeValue = { start: '', stop: '' }

const Root = ({ value, defaultValue = empty, onValueChange, children }: RootProps) => {
	const [stored, setStored] = useControllableState(value, defaultValue, onValueChange)
	const current = stored ?? empty

	return (
		<TimeRangeContext value={{ value: current, change: next => setStored({ ...current, ...next }) }}>
			{children}
		</TimeRangeContext>
	)
}

type TimeFieldProps = Omit<ComponentPropsWithRef<typeof Input>, 'type' | 'value'>

/** Start and stop are the same field bound to a different edge of the range. */
const TimeField = ({ edge, className, ...props }: TimeFieldProps & { edge: keyof TimeRangeValue }) => {
	const { value, change } = useTimeRange()

	return (
		<Input
			data-slot={`time-range-${edge}`}
			type='time'
			{...props}
			value={value[edge]}
			onChange={event => change({ [edge]: event.target.value })}
			className={cn('tabular-nums', className)}
		/>
	)
}

const Start = (props: TimeFieldProps) => <TimeField edge='start' {...props} />
const Stop = (props: TimeFieldProps) => <TimeField edge='stop' {...props} />

/** The time between start and stop. A stop before the start means the next day. */
const Duration = ({ className, ...props }: Omit<ComponentPropsWithRef<'output'>, 'children'>) => {
	const { value } = useTimeRange()
	const minutes = minutesBetween(value.start, value.stop)

	return (
		<output data-slot='time-range-duration' {...props} className={cn(mutedText, 'tabular-nums', className)}>
			{minutes === null ? '' : formatDuration(minutes)}
		</output>
	)
}

export { Root, Start, Stop, Duration }
export type { RootProps, TimeRangeValue }
