import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const icon = tv({
	base: 'inline-flex shrink-0 items-center justify-center',
	variants: {
		size: {
			sm: '[&>svg]:size-4',
			md: '[&>svg]:size-5',
			lg: '[&>svg]:size-6',
			xl: '[&>svg]:size-8',
		},
	},
	defaultVariants: { size: 'md' },
})

type IconProps = ComponentPropsWithRef<'span'> & VariantProps<typeof icon>

/** Sizes any svg child and hides it from assistive tech unless a label is given. */
const Icon = ({ size, className, 'aria-label': label, ...props }: IconProps) => (
	<span
		data-slot='icon'
		role={label ? 'img' : undefined}
		aria-label={label}
		aria-hidden={label ? undefined : true}
		{...props}
		className={icon({ size, class: className })}
	/>
)

export { Icon }
export type { IconProps }
