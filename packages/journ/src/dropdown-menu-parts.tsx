'use client'

import * as RadixMenu from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { floatingItem, floatingLabel, floatingSeparator, floatingSurface } from './lib/overlay'
import { useEnter } from './lib/use-enter'

const Root = RadixMenu.Root
const Trigger = RadixMenu.Trigger
const Group = RadixMenu.Group

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixMenu.Content>) => {
	const panel = useEnter<HTMLDivElement>({ opacity: [0, 1], scale: [0.96, 1], duration: 200, ease: 'outQuad' })

	return (
		<RadixMenu.Portal>
			<RadixMenu.Content
				ref={panel}
				data-slot='dropdown-menu-content'
				sideOffset={6}
				{...props}
				className={cn(floatingSurface, className)}
			/>
		</RadixMenu.Portal>
	)
}

const Item = ({ className, ...props }: ComponentPropsWithRef<typeof RadixMenu.Item>) => (
	<RadixMenu.Item data-slot='dropdown-menu-item' {...props} className={cn(floatingItem, className)} />
)

const Label = ({ className, ...props }: ComponentPropsWithRef<typeof RadixMenu.Label>) => (
	<RadixMenu.Label data-slot='dropdown-menu-label' {...props} className={cn(floatingLabel, className)} />
)

const Separator = ({ className, ...props }: ComponentPropsWithRef<typeof RadixMenu.Separator>) => (
	<RadixMenu.Separator data-slot='dropdown-menu-separator' {...props} className={cn(floatingSeparator, className)} />
)

export { Root, Trigger, Group, Content, Item, Label, Separator }
