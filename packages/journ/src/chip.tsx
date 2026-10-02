import { X } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'
import { inkTone, solidTones } from './lib/tones'
import { accentText, dim } from './lib/theme'

const chipRoot = tv({
	base: 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs',
	variants: {
		tone: {
			light: 'bg-journ-paper/60 text-journ-ink',
			ink: inkTone,
			dim: `${dim} ${accentText}`,
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

/** A small close button for chips that can be dismissed. `label` is the accessible name. */
const Remove = ({ label, className, ...props }: ComponentPropsWithRef<'button'> & { label: string }) => (
	<button
		type='button'
		data-slot='chip-remove'
		aria-label={label}
		{...props}
		className={cn(
			'grid size-5 cursor-default place-items-center rounded-full outline-none hover:bg-current/15 focus-visible:outline-2 focus-visible:outline-journ-sky [&>svg]:size-3',
			className,
		)}
	>
		<X />
	</button>
)

type TagProps = ComponentPropsWithRef<typeof Root> & {
	/** Shows a remove button when given. Leave it out for a chip that cannot be dismissed. */
	onRemove?: () => void
	removeLabel?: string
}

/** A chip with a remove button: the shape of a selected value. */
const Tag = ({ onRemove, removeLabel = 'Remove', tone = 'dim', className, children, ...props }: TagProps) => (
	<Root data-slot='chip-tag' tone={tone} {...props} className={cn(onRemove && 'gap-1 py-1 pr-1 pl-2.5', className)}>
		{children}
		{onRemove && <Remove label={removeLabel} onClick={onRemove} />}
	</Root>
)

const Chip = { Root, Dot, Remove, Tag }

export { Chip }
export type { RootProps as ChipProps }
