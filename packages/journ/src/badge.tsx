import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'
import { inkTone, solidTones } from './lib/tones'

const badge = tv({
	base: 'inline-flex items-center rounded-full px-2 py-0.5 text-xs/5 font-semibold tabular-nums',
	variants: {
		tone: {
			...solidTones,
			ink: inkTone,
		},
	},
	defaultVariants: { tone: 'paper' },
})

type BadgeProps = ComponentPropsWithRef<'span'> & VariantProps<typeof badge>

const Badge = ({ tone, className, ...props }: BadgeProps) => (
	<span data-slot='badge' {...props} className={badge({ tone, class: className })} />
)

export { Badge }
export type { BadgeProps }
