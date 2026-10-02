import type { ComponentPropsWithRef } from 'react'
import { surfaceTones } from './lib/tones'
import { tv, type VariantProps } from './lib/tv'
import { displayTitle, mutedText } from './lib/text-styles'
import { iconTile } from './lib/icon-tile'

const cardRoot = tv({
	base: 'rounded-journ flex flex-col gap-3 p-5',
	variants: {
		tone: surfaceTones,
	},
	defaultVariants: { tone: 'dark' },
})

const cardHeader = tv({ base: 'flex items-start justify-between gap-4' })
const cardTitle = tv({ base: displayTitle })
const cardDescription = tv({ base: mutedText })
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

const Icon = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='card-icon' {...props} className={iconTile({ size: 'md', tone: 'yellow', class: className })} />
)

const Card = { Root, Icon, Header, Title, Description, Content, Footer }
type CardProps = RootProps

export { Card }
export type { CardProps }
