import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'dl'>) => (
	<dl
		data-slot='description-list'
		{...props}
		className={cn('grid grid-cols-1 text-sm/6 sm:grid-cols-[minmax(8rem,1fr)_3fr]', className)}
	/>
)

const Term = ({ className, ...props }: ComponentPropsWithRef<'dt'>) => (
	<dt
		data-slot='description-list-term'
		{...props}
		className={cn('border-t border-current/10 pt-3 font-mono text-xs uppercase opacity-60 sm:py-3', className)}
	/>
)

const Details = ({ className, ...props }: ComponentPropsWithRef<'dd'>) => (
	<dd
		data-slot='description-list-details'
		{...props}
		className={cn('pb-3 sm:border-t sm:border-current/10 sm:py-3', className)}
	/>
)

const DescriptionList = { Root, Term, Details }

export { DescriptionList }
