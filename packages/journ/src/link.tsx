import { Slot } from '@radix-ui/react-slot'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

type LinkProps = ComponentPropsWithRef<'a'> & { asChild?: boolean }

/** Pass `asChild` to style your router's link component instead of a plain anchor. */
const Link = ({ asChild, className, ...props }: LinkProps) => {
	const Component = asChild ? Slot : 'a'

	return (
		<Component
			data-slot='link'
			{...props}
			className={cn(
				'underline decoration-current/40 underline-offset-4 outline-none transition-colors hover:decoration-current',
				'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
				className,
			)}
		/>
	)
}

export { Link }
export type { LinkProps }
