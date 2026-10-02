import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { field } from './input'

const Textarea = ({ className, rows = 4, ...props }: ComponentPropsWithRef<'textarea'>) => (
	<textarea
		data-slot='textarea'
		rows={rows}
		{...props}
		className={cn(field, 'resize-y rounded-3xl py-3 sm:py-2.5', className)}
	/>
)

export { Textarea }
