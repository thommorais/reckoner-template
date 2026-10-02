import type { ComponentPropsWithRef } from 'react'
import { tv, type VariantProps } from './lib/tv'

const cardRoot = tv({
	base: 'rounded-journ flex flex-col gap-3 p-5',
	variants: {
		tone: {
			dark: 'bg-journ-surface text-journ-paper',
			coral: 'bg-journ-coral text-journ-ink',
			yellow: 'bg-journ-yellow text-journ-ink',
			indigo: 'bg-journ-indigo text-journ-ink',
			mint: 'bg-journ-mint text-journ-ink',
			sky: 'bg-journ-sky text-journ-ink',
		},
	},
	defaultVariants: { tone: 'dark' },
})

const cardHeader = tv({ base: 'flex items-start justify-between gap-4' })
const cardTitle = tv({ base: 'font-journ-display text-3xl/[0.95] font-semibold uppercase' })
const cardDescription = tv({ base: 'text-sm/5 opacity-70' })
const cardContent = tv({ base: 'flex flex-col gap-2' })
const cardFooter = tv({ base: 'flex flex-wrap items-center gap-2' })

type RootProps = ComponentPropsWithRef<'div'> & VariantProps<typeof cardRoot>

const Root = ({ tone, className, ...props }: RootProps) => (
	<div data-slot='card' {...props} className={cardRoot({ tone, class: className })} />
)

const Header = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='card-header' {...props} className={cardHeader({ class: className })} />
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'h3'>) => (
	<h3 data-slot='card-title' {...props} className={cardTitle({ class: className })} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='card-description' {...props} className={cardDescription({ class: className })} />
)

const Content = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='card-content' {...props} className={cardContent({ class: className })} />
)

const Footer = ({ className, ...props }: ComponentPropsWithRef<'footer'>) => (
	<footer data-slot='card-footer' {...props} className={cardFooter({ class: className })} />
)

const Card = { Root, Header, Title, Description, Content, Footer }
type CardProps = RootProps

export { Card }
export type { CardProps }
