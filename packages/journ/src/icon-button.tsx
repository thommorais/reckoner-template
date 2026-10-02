import type { ComponentPropsWithRef } from 'react'
import { interactive } from './lib/interactive'
import { tv, type VariantProps } from './lib/tv'
import { TouchTarget } from './touch-target'

const iconButton = tv({
	base: [interactive, 'grid shrink-0 place-items-center rounded-full'],
	variants: {
		tone: {
			paper: 'bg-journ-paper text-journ-ink',
			ink: 'bg-journ-ink text-journ-paper',
			coral: 'bg-journ-coral text-journ-ink',
			ghost: 'bg-current/10 text-inherit',
		},
		size: {
			sm: 'size-8 [&>svg]:size-4',
			md: 'size-10 [&>svg]:size-5',
		},
	},
	defaultVariants: { tone: 'paper', size: 'md' },
})

type IconButtonProps = ComponentPropsWithRef<'button'> & VariantProps<typeof iconButton>

const IconButton = ({ tone, size, className, children, type = 'button', ...props }: IconButtonProps) => (
	<button data-slot='icon-button' type={type} {...props} className={iconButton({ tone, size, class: className })}>
		<TouchTarget>{children}</TouchTarget>
	</button>
)

export { IconButton }
export type { IconButtonProps }
