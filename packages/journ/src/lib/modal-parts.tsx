import type { ComponentPropsWithRef } from 'react'
import { cn } from './cn'

/** Shared by Dialog, AlertDialog and Drawer. */
const Body = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='modal-body'
		{...props}
		className={cn('scrollbar-journ flex flex-col gap-3 overflow-y-auto', className)}
	/>
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='modal-actions' {...props} className={cn('flex items-center justify-end gap-2', className)} />
)

export { Actions, Body }
