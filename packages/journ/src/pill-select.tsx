import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const PillSelect = ({ className, children, ...props }: ComponentPropsWithRef<'select'>) => (
	<span data-slot='pill-select' className='relative inline-block'>
		<select
			{...props}
			className={cn(
				'appearance-none rounded-full bg-journ-paper py-2 pr-9 pl-4 text-sm text-journ-ink outline-none focus-visible:ring-2 focus-visible:ring-journ-sky',
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
