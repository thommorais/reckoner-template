'use client'

import { useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Chip } from './chip'
import { Empty, Frame, Group, Input as ComboboxInput, ItemIndicator, List, Option } from './combobox-parts'
import { createPicker } from './lib/picker'
import { createRequiredContext } from './lib/required-context'

const {
	Provider,
	Trigger,
	Value: PickerValue,
	usePickerState,
} = createPicker<string[]>('MultipleSelector', 'multiple-selector', {
	closeOnSelect: false,
	isEmpty: value => !value || value.length === 0,
})

type SelectionContextValue = {
	selected: string[]
	fixed: string[]
	/** True once `max` values are chosen: nothing more can be added. */
	full: boolean
	search: string
	setSearch: (search: string) => void
	toggle: (value: string) => void
	remove: (value: string) => void
	create: (text: string) => void
}

const [SelectionContext, useMultipleSelector] = createRequiredContext<SelectionContextValue>('MultipleSelector.Root')

type RootProps = {
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (value: string[]) => void
	/** Values that are always selected and cannot be removed. */
	fixed?: string[]
	/** The most values that can be selected. */
	max?: number
	children?: ReactNode
}

const none: string[] = []

/**
 * A combobox that keeps its drawer open and collects values. A value is also its
 * label. Build the list from Combobox's parts, plus `Create` to allow new values.
 */
const Root = ({ value, defaultValue = none, onValueChange, fixed = none, max, children }: RootProps) => {
	const { state, actions } = usePickerState(value, defaultValue, onValueChange)
	const [search, setSearch] = useState('')

	const selected = [...new Set([...fixed, ...(state.value ?? none)])]
	const full = max !== undefined && selected.length >= max
	const set = (next: string[]) => actions.select(next)
	const remove = (item: string) => {
		if (!fixed.includes(item) && selected.includes(item)) set(selected.filter(existing => existing !== item))
	}

	return (
		<Provider
			state={{ value: selected, open: state.open }}
			actions={{
				...actions,
				setOpen: open => {
					if (!open) setSearch('')
					actions.setOpen(open)
				},
			}}
		>
			<SelectionContext
				value={{
					selected,
					fixed,
					full,
					search,
					setSearch,
					remove,
					toggle: item => (selected.includes(item) ? remove(item) : !full && set([...selected, item])),
					create: text => {
						const item = text.trim()
						setSearch('')
						if (item && !full && !selected.some(existing => existing.toLowerCase() === item.toLowerCase()))
							set([...selected, item])
					},
				}}
			>
				{children}
			</SelectionContext>
		</Provider>
	)
}

/** The count of chosen values, or `children` when given. */
const Value = ({ placeholder, children, ...props }: ComponentPropsWithRef<typeof PickerValue>) => {
	const { selected } = useMultipleSelector()

	return (
		<PickerValue placeholder={placeholder} {...props}>
			{children ?? `${selected.length} selected`}
		</PickerValue>
	)
}

/** One chip per chosen value, with a remove button unless the value is fixed. */
const Tags = () => {
	const { selected, fixed, remove } = useMultipleSelector()

	return selected.map(item => (
		<Chip.Tag
			key={item}
			removeLabel={`Remove ${item}`}
			onRemove={fixed.includes(item) ? undefined : () => remove(item)}
		>
			{item}
		</Chip.Tag>
	))
}

const Input = (props: ComponentPropsWithRef<typeof ComboboxInput>) => {
	const { search, setSearch } = useMultipleSelector()
	return <ComboboxInput {...props} value={search} onValueChange={setSearch} />
}

/** Toggles its value. Fixed values are locked, and unchosen values lock once `max` is reached. */
const Item = ({ value, disabled, ...props }: Omit<ComponentPropsWithRef<typeof Option>, 'checked' | 'onPick'>) => {
	const { selected, fixed, full, toggle } = useMultipleSelector()
	const checked = selected.includes(value)

	return (
		<Option
			{...props}
			value={value}
			checked={checked}
			disabled={disabled || fixed.includes(value) || (full && !checked)}
			onPick={toggle}
		/>
	)
}

/** Offers the typed text as a new value. Hidden when empty, already chosen, or the selection is full. */
const Create = ({
	children = 'Create',
	...props
}: Omit<ComponentPropsWithRef<typeof Option>, 'value' | 'checked' | 'onPick'>) => {
	const { selected, full, search, create } = useMultipleSelector()
	const typed = search.trim()
	if (!typed || full || selected.some(existing => existing.toLowerCase() === typed.toLowerCase())) return null

	return (
		<Option {...props} forceMount value={`__create__${typed}`} checked={false} onPick={() => create(typed)}>
			{children} “{typed}”
		</Option>
	)
}

export {
	Root,
	Trigger,
	Value,
	Tags,
	Frame,
	Input,
	List,
	Empty,
	Group,
	Item,
	ItemIndicator,
	Create,
	useMultipleSelector,
}
export type { RootProps }
