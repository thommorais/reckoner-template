'use client'

import { Command } from 'cmdk'
import { Check, Search } from 'lucide-react'
import { useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cn } from './lib/cn'
import { controlSize, mutedText } from './lib/text-styles'
import { createPicker, type PickerActions, type PickerContextValue, type PickerState } from './lib/picker'
import { createRequiredContext } from './lib/required-context'

type ComboboxState = PickerState<string>
type ComboboxActions = PickerActions<string>
type ComboboxContextValue = Omit<PickerContextValue<string, object>, 'meta'>

const {
	ContextProvider,
	Provider,
	Trigger,
	Value,
	usePicker: useCombobox,
	usePickerState,
} = createPicker<string>('Combobox', 'combobox')
const [ItemContext, useComboboxItem] = createRequiredContext<{ checked: boolean }>('Combobox.Item')

const normalize = (text: string) =>
	text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()

const matchKeywords = (value: string, search: string, keywords?: string[]) =>
	normalize(keywords?.length ? keywords.join(' ') : value).includes(normalize(search)) ? 1 : 0

type RootProps = {
	value?: string | null
	defaultValue?: string | null
	onValueChange?: (value: string) => void
	children?: ReactNode
}

const Root = ({ value, defaultValue = null, onValueChange, children }: RootProps) => {
	const { state, actions } = usePickerState(value, defaultValue, onValueChange)
	return (
		<Provider state={state} actions={actions}>
			{children}
		</Provider>
	)
}

const Frame = ({ filter = matchKeywords, className, ...props }: ComponentPropsWithRef<typeof Command>) => (
	<Command
		data-slot='combobox'
		loop
		filter={filter}
		{...props}
		className={cn('flex min-h-0 flex-col gap-3', className)}
	/>
)

const Input = ({ className, ...props }: ComponentPropsWithRef<typeof Command.Input>) => (
	<div
		data-slot='combobox-input'
		className='sm:focus-within:outline-journ-sky flex items-center gap-2 rounded-full bg-current/10 px-4 sm:focus-within:outline-2'
	>
		<Search aria-hidden className='size-4 shrink-0 opacity-70' />
		<Command.Input
			{...props}
			className={cn(controlSize, 'min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/50', className)}
		/>
	</div>
)

const List = ({ className, ...props }: ComponentPropsWithRef<typeof Command.List>) => (
	<Command.List
		data-slot='combobox-list'
		{...props}
		className={cn('scrollbar-journ max-h-72 overflow-y-auto overscroll-contain', className)}
	/>
)

const Empty = ({ className, ...props }: ComponentPropsWithRef<typeof Command.Empty>) => (
	<Command.Empty data-slot='combobox-empty' {...props} className={cn('py-6 text-center', mutedText, className)} />
)

const Group = ({ className, ...props }: ComponentPropsWithRef<typeof Command.Group>) => (
	<Command.Group
		data-slot='combobox-group'
		{...props}
		className={cn(
			'[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:opacity-70',
			className,
		)}
	/>
)

type ItemProps = Omit<ComponentPropsWithRef<typeof Command.Item>, 'value'> & {
	value: string
}

const Item = ({ value, onSelect, className, ...props }: ItemProps) => {
	const { state, actions } = useCombobox()
	const checked = state.value === value

	return (
		<ItemContext value={{ checked }}>
			<Command.Item
				data-slot='combobox-item'
				data-checked={checked}
				value={value}
				{...props}
				onSelect={search => {
					onSelect?.(search)
					actions.select(value)
				}}
				className={cn(
					controlSize,
					'relative isolate flex items-center gap-3 rounded-full px-4 select-none [&>svg]:size-4 [&>svg]:shrink-0',
					'after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] data-[selected=true]:after:bg-current/10',
					'data-[checked=true]:bg-journ-coral data-[checked=true]:font-medium data-[checked=true]:text-journ-ink',
					'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
					className,
				)}
			/>
		</ItemContext>
	)
}

const ItemIndicator = ({ className, children, ...props }: ComponentPropsWithRef<'span'>) => {
	const item = useComboboxItem()
	if (!item.checked) return null

	return (
		<span
			data-slot='combobox-item-indicator'
			aria-hidden
			{...props}
			className={cn('ml-auto grid place-items-center [&>svg]:size-4', className)}
		>
			{children ?? <Check />}
		</span>
	)
}

export {
	ContextProvider,
	Provider,
	Root,
	Trigger,
	Value,
	Frame,
	Input,
	List,
	Empty,
	Group,
	Item,
	ItemIndicator,
	useCombobox,
}
export type { ComboboxActions, ComboboxContextValue, ComboboxState, RootProps }
