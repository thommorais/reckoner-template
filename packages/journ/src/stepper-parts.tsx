'use client'

import { Check } from 'lucide-react'
import { type ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { mutedText } from './lib/text-styles'
import { createRequiredContext } from './lib/required-context'

type StepStatus = 'complete' | 'current' | 'upcoming'

type StepperContextValue = { value: number }
type ItemContextValue = { step: number; status: StepStatus }

const [StepperContext, useStepper] = createRequiredContext<StepperContextValue>('Stepper.Root')
const [ItemContext, useItem] = createRequiredContext<ItemContextValue>('Stepper.Item')

type RootProps = ComponentPropsWithRef<'ol'> & {
	/** The step the user is on, starting at 1. */
	value: number
}

const Root = ({ value, className, ...props }: RootProps) => (
	<StepperContext value={{ value }}>
		<ol data-slot='stepper' {...props} className={cn('flex flex-col gap-4 sm:flex-row sm:gap-6', className)} />
	</StepperContext>
)

type ItemProps = ComponentPropsWithRef<'li'> & { step: number }

const Item = ({ step, className, ...props }: ItemProps) => {
	const context = useStepper()
	const status: StepStatus = step < context.value ? 'complete' : step === context.value ? 'current' : 'upcoming'

	return (
		<ItemContext value={{ step, status }}>
			<li
				data-slot='stepper-item'
				data-status={status}
				aria-current={status === 'current' ? 'step' : undefined}
				{...props}
				className={cn('group flex flex-1 items-start gap-3 data-[status=upcoming]:opacity-60', className)}
			/>
		</ItemContext>
	)
}

/** Shows a check for completed steps and the step number otherwise. */
const Indicator = ({ className, children, ...props }: ComponentPropsWithRef<'span'>) => {
	const { step, status } = useItem()

	return (
		<span
			data-slot='stepper-indicator'
			aria-hidden
			{...props}
			className={cn(
				'grid size-8 shrink-0 place-items-center rounded-full bg-current/15 text-sm font-semibold tabular-nums',
				'group-data-[status=current]:bg-journ-sky group-data-[status=current]:text-journ-ink',
				'group-data-[status=complete]:bg-journ-mint group-data-[status=complete]:text-journ-ink [&>svg]:size-4',
				className,
			)}
		>
			{children ?? (status === 'complete' ? <Check /> : step)}
		</span>
	)
}

const Label = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='stepper-label' {...props} className={cn('block text-sm/6 font-medium', className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='stepper-description' {...props} className={cn('block', mutedText, className)} />
)

export { Root, Item, Indicator, Label, Description }
