'use client'

import { Command } from 'cmdk'
import { Check, Search } from 'lucide-react'
import { createContext, use, useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Button, type ButtonProps } from './button'
import { Root as DrawerRoot, Trigger as DrawerTrigger } from './drawer-parts'
import { cn } from './lib/cn'
import { useControllableState } from './lib/use-controllable-state'

type ComboboxState = {
	value: string | null
	open: boolean
}

type ComboboxActions = {
	select: (value: string) => void
	setOpen: (open: boolean) => void
}

type ComboboxContextValue = {
	state: ComboboxState
	actions: ComboboxActions
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)
const ItemContext = createContext<{ checked: boolean } | null>(null)

const useCombobox = (): ComboboxContextValue => {
	const context = use(ComboboxContext)
	if (!context) throw new Error('Combobox parts must be rendered inside Combobox.Provider or Combobox.Root')
	return context
}

const normalize = (text: string) =>
	text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()

const matchKeywords = (value: string, search: string, keywords?: string[]) =>
	normalize(keywords?.length ? keywords.join(' ') : value).includes(normalize(search)) ? 1 : 0

type ProviderProps = ComboboxContextValue & { children?: ReactNode }

const Provider = ({ state, actions, children }: ProviderProps) => (
	<ComboboxContext value={{ state, actions }}>
		<DrawerRoot open={state.open} onOpenChange={actions.setOpen}>
			{children}
		</DrawerRoot>
	</ComboboxContext>
)

type RootProps = {
	value?: string | null
	defaultValue?: string | null
	onValueChange?: (value: string) => void
	children?: ReactNode
}

const Root = ({ value, defaultValue = null, onValueChange, children }: RootProps) => {
	const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
	const [open, setOpen] = useState(false)

	const actions: ComboboxActions = {
		select: next => {
			setCurrent(next)
			setOpen(false)
		},
		setOpen,
	}

	return (
		<Provider state={{ value: current, open }} actions={actions}>
			{children}
		</Provider>
	)
}

type TriggerProps = ComponentPropsWithRef<'button'> & {
	tone?: ButtonProps['tone']
}

const Trigger = ({ tone = 'paper', className, ...props }: TriggerProps) => (
	<DrawerTrigger asChild>
		<Button data-slot='combobox-trigger' tone={tone} {...props} className={cn('justify-start', className)} />
	</DrawerTrigger>
)

type ValueProps = ComponentPropsWithRef<'span'> & {
	placeholder?: string
}

const Value = ({ placeholder, className, children, ...props }: ValueProps) => {
	const { state } = useCombobox()

	return (
		<span
			data-slot='combobox-value'
			data-placeholder={state.value === null}
			{...props}
			className={cn('truncate data-[placeholder=true]:opacity-70', className)}
		>
			{state.value === null ? placeholder : children}
		</span>
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
			className={cn(
				'min-w-0 flex-1 bg-transparent py-2.5 text-base/6 outline-none placeholder:text-current/50 sm:py-1.5 sm:text-sm/6',
				className,
			)}
		/>
	</div>
)

const List = ({ className, ...props }: ComponentPropsWithRef<typeof Command.List>) => (
	<Command.List
		data-slot='combobox-list'
		{...props}
		className={cn('max-h-72 overflow-y-auto overscroll-contain', className)}
	/>
)

const Empty = ({ className, ...props }: ComponentPropsWithRef<typeof Command.Empty>) => (
	<Command.Empty
		data-slot='combobox-empty'
		{...props}
		className={cn('py-6 text-center text-sm/5 opacity-70', className)}
	/>
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
					'relative isolate flex items-center gap-3 rounded-full px-4 py-2.5 text-base/6 select-none sm:py-1.5 sm:text-sm/6 [&>svg]:size-4 [&>svg]:shrink-0',
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
	const item = use(ItemContext)
	if (!item) throw new Error('Combobox.ItemIndicator must be rendered inside Combobox.Item')
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

export { Provider, Root, Trigger, Value, Frame, Input, List, Empty, Group, Item, ItemIndicator, useCombobox }
export type { ComboboxActions, ComboboxContextValue, ComboboxState, RootProps }
