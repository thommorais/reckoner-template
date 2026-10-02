'use client'

import { Minus, Plus } from 'lucide-react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Composer } from './composer'
import type { IconButton } from './icon-button'
import { cn } from './lib/cn'
import { commitOn } from './lib/commit-on'
import { StepButton } from './step-button'
import { clamp, parseNumber } from './lib/number'
import { createRequiredContext } from './lib/required-context'
import { useDraft } from './lib/use-draft'
import { useControllableState } from './lib/use-controllable-state'

type QuantityContextValue = {
	value: number
	min: number
	max: number
	disabled: boolean
	text: string
	edit: (text: string) => void
	step: (direction: -1 | 1) => void
	commit: () => void
}

const [QuantityContext, useQuantity] = createRequiredContext<QuantityContextValue>('QuantityInput.Root')

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> & {
	value?: number
	defaultValue?: number
	onValueChange?: (value: number) => void
	min?: number
	max?: number
	step?: number
	disabled?: boolean
	children?: ReactNode
}

/** A number with minus and plus. Typing is free until blur or Enter, then it snaps to the bounds. */
const Root = ({
	value,
	defaultValue = 0,
	onValueChange,
	min = -Infinity,
	max = Infinity,
	step = 1,
	disabled = false,
	children,
	...props
}: RootProps) => {
	const [stored, setStored] = useControllableState(value, defaultValue, onValueChange)
	const current = clamp(stored ?? 0, min, max)
	const { text, edit, discard, commit } = useDraft({
		value: current,
		format: String,
		parse: typed => parseNumber(typed) ?? undefined,
		onCommit: typed => setStored(clamp(typed, min, max)),
	})

	return (
		<QuantityContext
			value={{
				value: current,
				min,
				max,
				disabled,
				text,
				edit,
				commit,
				step: direction => {
					discard()
					setStored(clamp(current + direction * step, min, max))
				},
			}}
		>
			<Composer.Root data-slot='quantity-input' aria-disabled={disabled || undefined} {...props}>
				{children}
			</Composer.Root>
		</QuantityContext>
	)
}

type StepProps = ComponentPropsWithRef<typeof IconButton>

const Decrement = (props: StepProps) => {
	const { value, min, disabled, step } = useQuantity()
	return (
		<StepButton
			data-slot='quantity-input-decrement'
			icon={Minus}
			aria-label='Decrease'
			disabled={disabled || value <= min}
			{...props}
			onStep={() => step(-1)}
		/>
	)
}

const Increment = (props: StepProps) => {
	const { value, max, disabled, step } = useQuantity()
	return (
		<StepButton
			data-slot='quantity-input-increment'
			icon={Plus}
			aria-label='Increase'
			disabled={disabled || value >= max}
			{...props}
			onStep={() => step(1)}
		/>
	)
}

const Field = ({ className, onBlur, onKeyDown, ...props }: ComponentPropsWithRef<typeof Composer.Input>) => {
	const { value, min, max, disabled, text, edit, step, commit } = useQuantity()

	return (
		<Composer.Input
			data-slot='quantity-input-field'
			inputMode='decimal'
			role='spinbutton'
			aria-valuenow={value}
			aria-valuemin={Number.isFinite(min) ? min : undefined}
			aria-valuemax={Number.isFinite(max) ? max : undefined}
			disabled={disabled}
			{...props}
			value={text}
			onChange={event => edit(event.target.value)}
			{...commitOn(commit, {
				onBlur,
				onKeyDown: event => {
					onKeyDown?.(event)
					if (event.key === 'ArrowUp') (event.preventDefault(), step(1))
					if (event.key === 'ArrowDown') (event.preventDefault(), step(-1))
				},
			})}
			className={cn('text-center tabular-nums', className)}
		/>
	)
}

export { Root, Decrement, Field, Increment }
export type { RootProps }
