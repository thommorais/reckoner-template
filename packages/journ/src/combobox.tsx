import {
	Empty,
	Frame,
	Group,
	Input,
	Item,
	ItemIndicator,
	List,
	Provider,
	Root,
	Trigger,
	Value,
	useCombobox,
	type ComboboxActions,
	type ComboboxContextValue,
	type ComboboxState,
	type RootProps,
} from './combobox-parts'
import { Content, Description, Title } from './drawer-parts'

const Combobox = {
	Provider,
	Root,
	Trigger,
	Value,
	Content,
	Title,
	Description,
	Frame,
	Input,
	List,
	Empty,
	Group,
	Item,
	ItemIndicator,
}

export { Combobox, useCombobox }
export type { ComboboxActions, ComboboxContextValue, ComboboxState, RootProps as ComboboxProps }
