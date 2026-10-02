'use client'

import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { type ComponentPropsWithRef } from 'react'
import { IconButton } from './icon-button'
import { cn } from './lib/cn'
import { addMonths, formatMonthYear, startOfMonth } from './lib/month'
import { useControllableState } from './lib/use-controllable-state'
import { createRequiredContext } from './lib/required-context'
import { displayHeading } from './lib/text-styles'

type MonthStepperContextValue = {
	month: Date
	locale: string
	step: (months: number) => void
}

const [MonthStepperContext, useMonthStepper] = createRequiredContext<MonthStepperContextValue>('MonthStepper.Root')

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
	value?: Date
	defaultValue?: Date
	onValueChange?: (month: Date) => void
	locale?: string
}

/** Always reports the first day of the month. */
const Root = ({ value, defaultValue, onValueChange, locale = 'en', className, ...props }: RootProps) => {
	const [selected, setSelected] = useControllableState(
		value ? startOfMonth(value) : undefined,
		startOfMonth(defaultValue ?? new Date()),
		onValueChange,
	)
	const month = selected ?? startOfMonth(new Date())

	return (
		<MonthStepperContext
			value={{
				month,
				locale,
				step: months => setSelected(addMonths(month, months)),
			}}
		>
			<div data-slot='month-stepper' {...props} className={cn('inline-flex items-center gap-2', className)} />
		</MonthStepperContext>
	)
}

type StepButtonProps = ComponentPropsWithRef<typeof IconButton> & {
	direction: -1 | 1
	icon: LucideIcon
}

const StepButton = ({ direction, icon: Icon, children, ...props }: StepButtonProps) => {
	const { step } = useMonthStepper()

	return (
		<IconButton data-slot='month-stepper-step' tone='ghost' size='sm' {...props} onClick={() => step(direction)}>
			{children ?? <Icon />}
		</IconButton>
	)
}

const Previous = (props: ComponentPropsWithRef<typeof IconButton>) => (
	<StepButton direction={-1} icon={ChevronLeft} aria-label='Previous month' {...props} />
)

const Next = (props: ComponentPropsWithRef<typeof IconButton>) => (
	<StepButton direction={1} icon={ChevronRight} aria-label='Next month' {...props} />
)

const Label = ({ className, ...props }: ComponentPropsWithRef<'span'>) => {
	const { month, locale } = useMonthStepper()

	return (
		<span
			data-slot='month-stepper-label'
			aria-live='polite'
			{...props}
			className={cn(displayHeading, 'min-w-36 text-center tabular-nums', className)}
		>
			{props.children ?? formatMonthYear(month, locale)}
		</span>
	)
}

export { Root, Previous, Label, Next }
