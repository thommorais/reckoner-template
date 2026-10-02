import { Content, Description, Title } from './drawer-parts'
import {
	Create,
	Empty,
	Frame,
	Group,
	Input,
	Item,
	ItemIndicator,
	List,
	Root,
	Tags,
	Trigger,
	Value,
	useMultipleSelector,
} from './multiple-selector-parts'

const MultipleSelector = {
	Root,
	Trigger,
	Value,
	Tags,
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
	Create,
}

export { MultipleSelector, useMultipleSelector }
export type { RootProps as MultipleSelectorProps } from './multiple-selector-parts'
