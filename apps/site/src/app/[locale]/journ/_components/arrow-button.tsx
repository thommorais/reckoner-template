import { cn } from 'journ'
import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'

const ArrowButton = ({ className, ...props }: ComponentPropsWithRef<'button'>) => (
	<button
		type='button'
		aria-label='Open'
		{...props}
		className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-journ-paper text-journ-ink', className)}
	>
		<ArrowUpRight className='size-4' />
	</button>
)

export { ArrowButton }
