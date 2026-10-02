'use client'

import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { floatingItem, floatingLabel, floatingSeparator, floatingSurface } from './lib/overlay'
import { useEnter } from './lib/use-enter'

const Root = RadixSelect.Root
const Group = RadixSelect.Group
const Value = RadixSelect.Value

const Trigger = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixSelect.Trigger>) => (
	<RadixSelect.Trigger
		data-slot='select-trigger'
		{...props}
		className={cn(
			pressReset,
			'inline-flex items-center justify-between gap-3 rounded-full bg-journ-paper py-2.5 pr-3 pl-4 text-base/6 text-journ-ink outline-none sm:py-1.5 sm:text-sm/6',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky data-[disabled]:opacity-50 data-[placeholder]:opacity-60',
			className,
		)}
	>
		{children}
		<RadixSelect.Icon>
			<ChevronDown aria-hidden className='size-4' />
		</RadixSelect.Icon>
	</RadixSelect.Trigger>
)

const Content = ({
	className,
	children,
	position = 'popper',
	...props
}: ComponentPropsWithRef<typeof RadixSelect.Content>) => {
	const panel = useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.96, 1], duration: 200, ease: 'outQuad' })

	return (
		<RadixSelect.Portal>
			<RadixSelect.Content
				ref={panel}
				data-slot='select-content'
				position={position}
				sideOffset={6}
				{...props}
				className={cn(floatingSurface, 'min-w-(--radix-select-trigger-width)', className)}
			>
				<RadixSelect.Viewport>{children}</RadixSelect.Viewport>
			</RadixSelect.Content>
		</RadixSelect.Portal>
	)
}

const Item = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixSelect.Item>) => (
	<RadixSelect.Item data-slot='select-item' {...props} className={cn(floatingItem, 'justify-between', className)}>
		<RadixSelect.ItemText>{children}</RadixSelect.ItemText>
		<RadixSelect.ItemIndicator>
			<Check />
		</RadixSelect.ItemIndicator>
	</RadixSelect.Item>
)

const Label = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSelect.Label>) => (
	<RadixSelect.Label data-slot='select-label' {...props} className={cn(floatingLabel, className)} />
)

const Separator = ({ className, ...props }: ComponentPropsWithRef<typeof RadixSelect.Separator>) => (
	<RadixSelect.Separator data-slot='select-separator' {...props} className={cn(floatingSeparator, className)} />
)

export { Root, Group, Value, Trigger, Content, Item, Label, Separator }
