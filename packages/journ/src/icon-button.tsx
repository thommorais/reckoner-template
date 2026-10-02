import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const iconButton = tv({
	base: 'focus-visible:ring-journ-sky grid shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2',
	variants: {
		tone: {
			paper: 'bg-journ-paper text-journ-ink',
			ink: 'bg-journ-ink text-journ-paper',
			coral: 'bg-journ-coral text-journ-ink',
			ghost: 'bg-journ-paper/10 text-journ-paper',
		},
		size: {
			sm: 'size-8 [&>svg]:size-4',
			md: 'size-10 [&>svg]:size-5',
		},
	},
	defaultVariants: { tone: 'paper', size: 'md' },
})

type IconButtonProps = ComponentPropsWithRef<'button'> & VariantProps<typeof iconButton>

const IconButton = ({ tone, size, className, type = 'button', ...props }: IconButtonProps) => (
	<button data-slot='icon-button' type={type} {...props} className={iconButton({ tone, size, class: className })} />
)

export { IconButton }
export type { IconButtonProps }
