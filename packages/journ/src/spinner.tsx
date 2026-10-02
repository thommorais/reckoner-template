import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

/** Announces itself as "Loading" unless `aria-hidden` says another element already does. */
const Spinner = ({ className, 'aria-hidden': hidden, ...props }: ComponentPropsWithRef<'svg'>) => (
	<svg
		data-slot='spinner'
		role={hidden ? undefined : 'status'}
		aria-label={hidden ? undefined : 'Loading'}
		aria-hidden={hidden}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={3}
		strokeLinecap='round'
		{...props}
		className={cn('size-5 animate-spin motion-reduce:animate-none', className)}
	>
		<circle cx='12' cy='12' r='9' className='opacity-20' />
		<path d='M21 12a9 9 0 0 0-9-9' />
	</svg>
)

export { Spinner }
