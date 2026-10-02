import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'
import { canvasTone, inkTone, solidTones } from './lib/tones'

const pageRoot = tv({
	base: 'min-h-dvh w-full',
	variants: {
		tone: {
			canvas: canvasTone,
			ink: inkTone,
			indigo: solidTones.indigo,
			mint: solidTones.mint,
			sky: solidTones.sky,
			yellow: solidTones.yellow,
			coral: solidTones.coral,
		},
	},
	defaultVariants: { tone: 'canvas' },
})

type RootProps = ComponentPropsWithRef<'div'> & VariantProps<typeof pageRoot>

const Root = ({ tone, className, ...props }: RootProps) => (
	<div data-slot='page' {...props} className={pageRoot({ tone, class: className })} />
)

const Content = ({ className, ...props }: ComponentPropsWithRef<'main'>) => (
	<main
		data-slot='page-content'
		{...props}
		className={cn(
			'mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-4 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
			className,
		)}
	/>
)

const Footer = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='page-footer' {...props} className={cn('sticky bottom-4 mt-auto', className)} />
)

const Page = { Root, Content, Footer }

export { Page }
export type { RootProps as PageProps }
