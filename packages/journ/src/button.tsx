import type { ComponentPropsWithRef } from 'react'
import { interactive } from './lib/interactive'
import { tv, type VariantProps } from './lib/tv'
import { TouchTarget } from './touch-target'

const button = tv({
	base: [
		interactive,
		'inline-flex items-center justify-center gap-x-2 rounded-full px-4 py-2.5 text-base/6 font-medium sm:py-1.5 sm:text-sm/6',
		'[&>svg]:size-5 [&>svg]:shrink-0 sm:[&>svg]:size-4',
	],
	variants: {
		tone: {
			paper: 'bg-journ-paper text-journ-ink',
			coral: 'bg-journ-coral text-journ-ink',
			yellow: 'bg-journ-yellow text-journ-ink',
			ink: 'bg-journ-ink text-journ-paper',
			ghost: 'text-journ-paper bg-transparent',
			outline: 'text-journ-paper border border-current/20 bg-transparent',
		},
	},
	defaultVariants: { tone: 'paper' },
})

type ButtonProps = VariantProps<typeof button> &
	(({ href?: never } & ComponentPropsWithRef<'button'>) | ({ href: string } & ComponentPropsWithRef<'a'>))

const Button = ({ tone, className, children, ...props }: ButtonProps) => {
	const classes = button({ tone, class: className })

	return typeof props.href === 'string' ? (
		<a data-slot='button' {...(props as ComponentPropsWithRef<'a'>)} className={classes}>
			<TouchTarget>{children}</TouchTarget>
		</a>
	) : (
		<button data-slot='button' type='button' {...(props as ComponentPropsWithRef<'button'>)} className={classes}>
			<TouchTarget>{children}</TouchTarget>
		</button>
	)
}

export { Button }
export type { ButtonProps }
