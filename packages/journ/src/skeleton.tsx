import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Skeleton = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='skeleton'
		aria-hidden
		{...props}
		className={cn('h-4 animate-pulse rounded-xl bg-current/10 motion-reduce:animate-none', className)}
	/>
)

export { Skeleton }
