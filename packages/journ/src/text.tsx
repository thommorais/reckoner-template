import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const text = tv({
	base: 'text-pretty',
	variants: {
		size: { sm: 'text-xs/5', md: 'text-sm/6', lg: 'text-base/7' },
		tone: { default: '', muted: 'opacity-70' },
	},
	defaultVariants: { size: 'md', tone: 'default' },
})

type TextProps = ComponentPropsWithRef<'p'> & VariantProps<typeof text>

const Text = ({ size, tone, className, ...props }: TextProps) => (
	<p data-slot='text' {...props} className={text({ size, tone, class: className })} />
)

export { Text }
export type { TextProps }
