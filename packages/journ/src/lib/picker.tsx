import { useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Button, type ButtonProps } from '../button'
import { Root as DrawerRoot, Trigger as DrawerTrigger } from '../drawer-parts'
import { cn } from './cn'
import { createRequiredContext } from './required-context'
import { useControllableState } from './use-controllable-state'

type PickerState<V> = { value: V | null; open: boolean }
type PickerActions<V> = { select: (value: V) => void; setOpen: (open: boolean) => void }
type PickerContextValue<V, M> = { state: PickerState<V>; actions: PickerActions<V>; meta: M }
type PickerProviderProps<V, M> = Omit<PickerContextValue<V, M>, 'meta'> & { meta?: M; children?: ReactNode }

/**
 * The state, trigger and value shared by every picker that opens in a drawer
 * (combobox, date picker, date range picker). `slot` prefixes each `data-slot`.
 */
type PickerOptions<V> = {
	/** Keep the drawer open after a pick, for pickers that choose several values. */
	closeOnSelect?: boolean
	/** When the value counts as empty and `Value` shows its placeholder. */
	isEmpty?: (value: V | null) => boolean
}

const createPicker = <V, M extends object = object>(
	name: string,
	slot: string,
	{ closeOnSelect = true, isEmpty = value => value === null }: PickerOptions<V> = {},
) => {
	const [Context, usePicker] = createRequiredContext<PickerContextValue<V, M>>(`${name}.Provider or ${name}.Root`)

	/** Shares state and actions without opening a drawer, for pickers hosted elsewhere. */
	const ContextProvider = ({ state, actions, meta = {} as M, children }: PickerProviderProps<V, M>) => (
		<Context value={{ state, actions, meta }}>{children}</Context>
	)

	const Provider = ({ children, ...props }: PickerProviderProps<V, M>) => (
		<ContextProvider {...props}>
			<DrawerRoot open={props.state.open} onOpenChange={props.actions.setOpen}>
				{children}
			</DrawerRoot>
		</ContextProvider>
	)

	/** Controllable value plus open state. Picking a value closes the drawer. */
	const usePickerState = (value: V | null | undefined, defaultValue: V | null, onValueChange?: (value: V) => void) => {
		const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
		const [open, setOpen] = useState(false)

		const state: PickerState<V> = { value: current, open }
		const actions: PickerActions<V> = {
			select: next => {
				setCurrent(next)
				if (closeOnSelect) setOpen(false)
			},
			setOpen,
		}

		return { state, actions }
	}

	const Trigger = ({
		tone = 'field',
		className,
		...props
	}: ComponentPropsWithRef<'button'> & { tone?: ButtonProps['tone'] }) => (
		<DrawerTrigger asChild>
			<Button data-slot={`${slot}-trigger`} tone={tone} {...props} className={cn('justify-start', className)} />
		</DrawerTrigger>
	)

	/** Shows `placeholder` until a value exists, then its children. */
	const Value = ({
		placeholder,
		className,
		children,
		...props
	}: ComponentPropsWithRef<'span'> & { placeholder?: string }) => {
		const { state } = usePicker()

		return (
			<span
				data-slot={`${slot}-value`}
				data-placeholder={isEmpty(state.value)}
				{...props}
				className={cn('truncate data-[placeholder=true]:opacity-70', className)}
			>
				{isEmpty(state.value) ? placeholder : children}
			</span>
		)
	}

	return { ContextProvider, Provider, Trigger, Value, usePicker, usePickerState }
}

export { createPicker }
export type { PickerActions, PickerContextValue, PickerProviderProps, PickerState }
