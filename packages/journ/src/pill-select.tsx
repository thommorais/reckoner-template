import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const PillSelect = ({ className, children, ...props }: ComponentPropsWithRef<'select'>) => (
	<span data-slot='pill-select' className='relative inline-block'>
		<select
			{...props}
			className={cn(
				'appearance-none rounded-full bg-journ-paper py-2.5 pr-9 pl-4 text-base/6 text-journ-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky disabled:opacity-50 sm:py-1.5 sm:text-sm/6',
				className,
			)}
		>
			{children}
		</select>
		<ChevronDown
			aria-hidden
			className='text-journ-ink pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2'
		/>
	</span>
)

export { PillSelect }
