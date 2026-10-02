import type { ComponentPropsWithRef, ElementType } from 'react'
import { cn } from './cn'
import { floatingItem, floatingLabel, floatingSeparator, floatingSurface } from './overlay'
import { usePopEnter } from './use-enter'

type MenuPrimitive = {
	Portal: ElementType
	Content: ElementType
	Item: ElementType
	Label: ElementType
	Separator: ElementType
}

/**
 * Styled Content, Item, Label and Separator for any Radix menu-like primitive
 * (dropdown menu, context menu, select). `slot` prefixes each `data-slot`.
 */
const createMenuParts = <P extends MenuPrimitive>(primitive: P, slot: string) => {
	const Portal = primitive.Portal
	const ContentPrimitive = primitive.Content
	const ItemPrimitive = primitive.Item
	const LabelPrimitive = primitive.Label
	const SeparatorPrimitive = primitive.Separator

	const Content = ({ className, ...props }: ComponentPropsWithRef<P['Content']> & { className?: string }) => {
		const panel = usePopEnter()

		return (
			<Portal>
				<ContentPrimitive
					ref={panel}
					data-slot={`${slot}-content`}
					sideOffset={6}
					{...props}
					className={cn(floatingSurface, className)}
				/>
			</Portal>
		)
	}

	const Item = ({ className, ...props }: ComponentPropsWithRef<P['Item']> & { className?: string }) => (
		<ItemPrimitive data-slot={`${slot}-item`} {...props} className={cn(floatingItem, className)} />
	)

	const Label = ({ className, ...props }: ComponentPropsWithRef<P['Label']> & { className?: string }) => (
		<LabelPrimitive data-slot={`${slot}-label`} {...props} className={cn(floatingLabel, className)} />
	)

	const Separator = ({ className, ...props }: ComponentPropsWithRef<P['Separator']> & { className?: string }) => (
		<SeparatorPrimitive data-slot={`${slot}-separator`} {...props} className={cn(floatingSeparator, className)} />
	)

	return { Content, Item, Label, Separator }
}

export { createMenuParts }
