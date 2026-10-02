'use client'

import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Input } from './input'
import { cn } from './lib/cn'
import { commitOn } from './lib/commit-on'
import { clamp, formatPlain, parseLocalizedNumber } from './lib/number'
import { createRequiredContext } from './lib/required-context'
import { useControllableState } from './lib/use-controllable-state'
import { useDraft } from './lib/use-draft'

type CurrencyContextValue = {
	text: string
	edit: (text: string) => void
	commit: () => void
	focus: () => void
	locale: string
}

const [CurrencyContext, useCurrency] = createRequiredContext<CurrencyContextValue>('CurrencyInput.Root')

type RootProps = {
	/** The amount, or null while empty. */
	value?: number | null
	defaultValue?: number | null
	onValueChange?: (value: number | null) => void
	currency?: string
	locale?: string
	min?: number
	max?: number
	children?: ReactNode
}

/**
 * An amount shown formatted ($1,234.50) and edited as plain digits. Typing is
 * free until blur or Enter, then it is read in the locale and snapped to the bounds.
 */
const Root = ({
	value,
	defaultValue = null,
	onValueChange,
	currency = 'USD',
	locale = 'en',
	min,
	max,
	children,
}: RootProps) => {
	const [stored, setStored] = useControllableState<number | null>(value, defaultValue, onValueChange)
	const amount = stored ?? null
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency })

	const { text, edit, commit } = useDraft<number | null>({
		value: amount,
		format: current => (current === null ? '' : money.format(current)),
		parse: typed => (typed.trim() === '' ? null : (parseLocalizedNumber(typed, locale) ?? undefined)),
		onCommit: typed => setStored(typed === null ? null : clamp(typed, min, max)),
	})

	return (
		<CurrencyContext
			value={{
				text,
				edit,
				commit,
				locale,
				focus: () => edit(amount === null ? '' : formatPlain(amount, locale)),
			}}
		>
			{children}
		</CurrencyContext>
	)
}

const Field = ({ className, onBlur, onKeyDown, onFocus, ...props }: ComponentPropsWithRef<typeof Input>) => {
	const { text, edit, commit, focus } = useCurrency()

	return (
		<Input
			data-slot='currency-input'
			inputMode='decimal'
			autoComplete='off'
			{...props}
			value={text}
			onChange={event => edit(event.target.value)}
			onFocus={event => {
				onFocus?.(event)
				focus()
			}}
			{...commitOn(commit, { onBlur, onKeyDown })}
			className={cn('text-right tabular-nums', className)}
		/>
	)
}

export { Root, Field }
export type { RootProps }
