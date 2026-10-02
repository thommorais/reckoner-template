'use client'

import * as RadixLabel from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { createContext, use, useId, type ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

type FieldContextValue = {
	id: string
	descriptionId: string
	errorId: string
	invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

const useField = (): FieldContextValue => {
	const context = use(FieldContext)
	if (!context) throw new Error('Field parts must be rendered inside Field.Root')
	return context
}

type RootProps = ComponentPropsWithRef<'div'> & { invalid?: boolean }

const Root = ({ invalid = false, className, ...props }: RootProps) => {
	const id = useId()

	return (
		<FieldContext value={{ id, descriptionId: `${id}-description`, errorId: `${id}-error`, invalid }}>
			<div
				data-slot='field'
				data-invalid={invalid || undefined}
				{...props}
				className={cn('flex flex-col gap-2', className)}
			/>
		</FieldContext>
	)
}

const Label = ({ className, ...props }: ComponentPropsWithRef<typeof RadixLabel.Root>) => {
	const { id } = useField()

	return (
		<RadixLabel.Root
			data-slot='field-label'
			htmlFor={id}
			{...props}
			className={cn('text-base/6 font-medium sm:text-sm/6', className)}
		/>
	)
}

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => {
	const { descriptionId } = useField()

	return (
		<p data-slot='field-description' id={descriptionId} {...props} className={cn('text-sm/5 opacity-70', className)} />
	)
}

const FieldError = ({ className, ...props }: ComponentPropsWithRef<'p'>) => {
	const { errorId, invalid } = useField()
	if (!invalid) return null

	return (
		<p
			data-slot='field-error'
			id={errorId}
			role='alert'
			{...props}
			className={cn('text-sm/5 font-medium text-journ-coral', className)}
		/>
	)
}

/** Passes the id and aria wiring to its single child, which is usually the input. */
const Control = (props: ComponentPropsWithRef<typeof Slot>) => {
	const { id, descriptionId, errorId, invalid } = useField()

	return (
		<Slot
			data-slot='field-control'
			id={id}
			aria-describedby={invalid ? `${descriptionId} ${errorId}` : descriptionId}
			aria-invalid={invalid || undefined}
			{...props}
		/>
	)
}

export { Root, Label, Description, FieldError as Error, Control }
