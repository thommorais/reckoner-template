'use client'

import * as RadixCollapsible from '@radix-ui/react-collapsible'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { useExpand } from './lib/use-enter'

const Root = RadixCollapsible.Root
const Trigger = RadixCollapsible.Trigger

const Content = ({ className, children, ...props }: ComponentPropsWithRef<typeof RadixCollapsible.Content>) => {
	const element = useExpand<HTMLDivElement>()

	return (
		<RadixCollapsible.Content ref={element} data-slot='collapsible-content' {...props} className='overflow-hidden'>
			<div className={cn('py-2', className)}>{children}</div>
		</RadixCollapsible.Content>
	)
}

export { Root, Trigger, Content }
