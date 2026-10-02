import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const badge = tv({
	base: 'inline-flex items-center rounded-full px-2 py-0.5 text-xs/5 font-semibold',
	variants: {
		tone: {
			paper: 'bg-journ-paper text-journ-ink',
			coral: 'bg-journ-coral text-journ-ink',
			yellow: 'bg-journ-yellow text-journ-ink',
			indigo: 'bg-journ-indigo text-journ-ink',
			mint: 'bg-journ-mint text-journ-ink',
			sky: 'bg-journ-sky text-journ-ink',
			ink: 'bg-journ-ink text-journ-paper',
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
