'use client'

import { useState, type ComponentPropsWithRef } from 'react'
import { Input } from './input'
import { formatDate, datePlaceholder, parseDate } from './lib/parse-date'
import { useControllableState } from './lib/use-controllable-state'
import { createRequiredContext } from './lib/required-context'

type DateInputContextValue = {
	text: string
	invalid: boolean
	locale: string
	setText: (text: string) => void
	commit: () => void
}

const [DateInputContext, useDateInput] = createRequiredContext<DateInputContextValue>('DateInput.Root')

type RootProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (date: Date | null) => void
	locale?: string
	children?: React.ReactNode
}

/** Holds the typed text and commits a real date on blur or Enter. */
const Root = ({ value, defaultValue = null, onValueChange, locale = 'en', children }: RootProps) => {
	const [date, setDate] = useControllableState<Date | null>(value, defaultValue, onValueChange)
	const [text, setText] = useState(date ? formatDate(date, locale) : '')
	const [invalid, setInvalid] = useState(false)

	const commit = () => {
		const parsed = parseDate(text, locale)
		if (text.trim() && !parsed) {
			setInvalid(true)
			return
		}
		setInvalid(false)
		setText(parsed ? formatDate(parsed, locale) : '')
		setDate(parsed)
	}

	return (
		<DateInputContext value={{ text, invalid, locale, setText: next => (setInvalid(false), setText(next)), commit }}>
			{children}
		</DateInputContext>
	)
}

const Field = ({ onBlur, onKeyDown, ...props }: ComponentPropsWithRef<typeof Input>) => {
	const { text, invalid, locale, setText, commit } = useDateInput()

	return (
		<Input
			data-slot='date-input'
			inputMode='numeric'
			autoComplete='off'
			placeholder={datePlaceholder(locale)}
			aria-invalid={invalid || undefined}
			{...props}
			value={text}
			onChange={event => setText(event.target.value)}
			onBlur={event => {
				onBlur?.(event)
				commit()
			}}
			onKeyDown={event => {
				onKeyDown?.(event)
				if (event.key === 'Enter') commit()
			}}
		/>
	)
}

export { Root, Field }
