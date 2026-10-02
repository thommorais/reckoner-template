import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'
import { inkTone, solidTones } from './lib/tones'

const chipRoot = tv({
	base: 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs',
	variants: {
		tone: {
			light: 'bg-journ-paper/60 text-journ-ink',
			ink: inkTone,
			dim: 'bg-journ-paper/10 text-journ-yellow',
			sky: solidTones.sky,
		},
	},
	defaultVariants: { tone: 'light' },
})

type RootProps = ComponentPropsWithRef<'span'> & VariantProps<typeof chipRoot>

const Root = ({ tone, className, ...props }: RootProps) => (
	<span data-slot='chip' {...props} className={chipRoot({ tone, class: className })} />
)

const Dot = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='chip-dot' aria-hidden {...props} className={cn('size-2.5 rounded-full bg-current', className)} />
)

const Chip = { Root, Dot }

export { Chip }
export type { RootProps as ChipProps }
