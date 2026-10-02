'use client'

import * as RadixNav from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { floatingSurface } from './lib/overlay'
import { controlSize, selectedWhenCurrent } from './lib/text-styles'
import { useDropEnter } from './lib/use-enter'

/** Includes the viewport, the panel that Content opens into. */
const Root = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixNav.Root>) => (
	<RadixNav.Root
		data-slot='navigation-menu'
		{...props}
		className={cn('relative flex max-w-max flex-1 items-center justify-center', className)}
	>
		{children}
		<div className='absolute top-full left-0 flex w-full justify-center pt-2'>
			<RadixNav.Viewport
				data-slot='navigation-menu-viewport'
				className={cn(
					floatingSurface,
					'relative h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden p-0 md:w-(--radix-navigation-menu-viewport-width)',
				)}
			/>
		</div>
	</RadixNav.Root>
)

const List = ({ className, ...props }: ComponentPropsWithRef<typeof RadixNav.List>) => (
	<RadixNav.List
		data-slot='navigation-menu-list'
		{...props}
		className={cn('flex list-none items-center gap-1', className)}
	/>
)

const Item = RadixNav.Item

const pill = (className?: string) =>
	cn(interactive, controlSize, 'inline-flex items-center gap-1.5 rounded-full px-4 font-medium', className)

const Trigger = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixNav.Trigger>) => (
	<RadixNav.Trigger data-slot='navigation-menu-trigger' {...props} className={pill(cn('group', className))}>
		{children}
		<ChevronDown aria-hidden className='size-4 transition-transform group-data-[state=open]:rotate-180' />
	</RadixNav.Trigger>
)

const Content = ({ className, ...props }: ComponentPropsWithRef<typeof RadixNav.Content>) => {
	const panel = useDropEnter()

	return (
		<RadixNav.Content
			ref={panel}
			data-slot='navigation-menu-content'
			{...props}
			className={cn('w-full p-2 md:w-96', className)}
		/>
	)
}

const Link = ({ className, ...props }: ComponentPropsWithRef<typeof RadixNav.Link>) => (
	<RadixNav.Link data-slot='navigation-menu-link' {...props} className={pill(cn(selectedWhenCurrent, className))} />
)

export { Root, List, Item, Trigger, Content, Link }
