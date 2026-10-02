'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { useExpand } from './lib/use-enter'
import { displayHeading } from './lib/text-styles'

const Root = RadixAccordion.Root

const Item = ({ className, ...props }: ComponentPropsWithRef<typeof RadixAccordion.Item>) => (
	<RadixAccordion.Item
		data-slot='accordion-item'
		{...props}
		className={cn('border-b border-current/15 last:border-b-0', className)}
	/>
)

const Trigger = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixAccordion.Trigger>) => (
	<RadixAccordion.Header className='flex'>
		<RadixAccordion.Trigger
			data-slot='accordion-trigger'
			{...props}
			className={cn(
				pressReset,
				displayHeading,
				'group flex flex-1 cursor-default items-center justify-between gap-4 py-3 text-left outline-none',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky disabled:opacity-50',
				className,
			)}
		>
			{children}
			<ChevronDown aria-hidden className='size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180' />
		</RadixAccordion.Trigger>
	</RadixAccordion.Header>
)

const Content = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixAccordion.Content>) => {
	const element = useExpand<HTMLDivElement>()

	return (
		<RadixAccordion.Content ref={element} data-slot='accordion-content' {...props} className='overflow-hidden'>
			<div className={cn('pb-3 text-sm/5', className)}>{children}</div>
		</RadixAccordion.Content>
	)
}

export { Root, Item, Trigger, Content }
