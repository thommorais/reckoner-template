import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const heading = tv({
	base: 'font-journ-display font-semibold uppercase',
	variants: {
		size: {
			sm: 'text-xl/none',
			md: 'text-3xl/[0.95]',
			lg: 'text-4xl/[0.95]',
			xl: 'text-6xl/[0.9]',
		},
	},
	defaultVariants: { size: 'lg' },
})

type HeadingProps = ComponentPropsWithRef<'h1'> & VariantProps<typeof heading> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }

/** `level` sets the document outline, `size` sets how big it looks. */
const Heading = ({ level = 1, size, className, ...props }: HeadingProps) => {
	const Element = `h${level}` as const

	return <Element data-slot='heading' {...props} className={heading({ size, class: className })} />
}

export { Heading }
export type { HeadingProps }
