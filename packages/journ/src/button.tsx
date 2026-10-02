import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { tv, type VariantProps } from './lib/tv'
import { Spinner } from './spinner'
import { TouchTarget } from './touch-target'
import { controlSize } from './lib/text-styles'
import { control } from './lib/theme'
import { inkTone, solidTones } from './lib/tones'

const button = tv({
	base: [
		interactive,
		controlSize,
		'inline-flex items-center justify-center gap-x-2 rounded-full px-4 font-medium',
		'[&>svg]:size-5 [&>svg]:shrink-0 sm:[&>svg]:size-4',
	],
	variants: {
		tone: {
			neutral: solidTones.neutral,
			field: control,
			coral: solidTones.coral,
			yellow: solidTones.yellow,
			ink: inkTone,
			ghost: 'bg-transparent text-inherit',
			outline: 'border border-current/20 bg-transparent text-inherit',
		},
	},
	defaultVariants: { tone: 'neutral' },
})

type ButtonProps = VariantProps<typeof button> & {
	/** Shows a spinner and ignores presses until the work is done. */
	pending?: boolean
} & (({ href?: never } & ComponentPropsWithRef<'button'>) | ({ href: string } & ComponentPropsWithRef<'a'>))

const Button = ({ tone, pending = false, className, children, ...props }: ButtonProps) => {
	const classes = button({ tone, class: cn(pending && 'aria-busy:pointer-events-none', className) })
	const busy = {
		'aria-busy': pending || undefined,
		'data-pending': pending || undefined,
		onClick: pending ? (event: React.MouseEvent) => event.preventDefault() : props.onClick,
	}
	const content = (
		<TouchTarget>
			{pending && <Spinner aria-hidden />}
			{children}
		</TouchTarget>
	)

	return typeof props.href === 'string' ? (
		<a data-slot='button' {...(props as ComponentPropsWithRef<'a'>)} {...(busy as object)} className={classes}>
			{content}
		</a>
	) : (
		<button
			data-slot='button'
			type='button'
			{...(props as ComponentPropsWithRef<'button'>)}
			{...(busy as object)}
			className={classes}
		>
			{content}
		</button>
	)
}

export { Button }
export type { ButtonProps }
