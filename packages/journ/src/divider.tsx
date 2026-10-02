import * as Separator from '@radix-ui/react-separator'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Divider = ({
	orientation = 'horizontal',
	decorative = true,
	className,
	...props
}: ComponentPropsWithRef<typeof Separator.Root>) => (
	<Separator.Root
		data-slot='divider'
		orientation={orientation}
		decorative={decorative}
		{...props}
		className={cn(
			'shrink-0 bg-current/15 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
			className,
		)}
	/>
)

export { Divider }
