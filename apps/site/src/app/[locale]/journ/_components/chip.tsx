import { cn } from 'journ'
import type { ComponentPropsWithRef } from 'react'

const Chip = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span
		{...props}
		className={cn(
			'inline-flex items-center gap-1.5 rounded-full bg-journ-paper/60 px-2.5 py-1 font-mono text-xs',
			className,
		)}
	/>
)

export { Chip }
