import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { tv, type VariantProps } from './lib/tv'

const pageRoot = tv({
	base: 'min-h-dvh w-full',
	variants: {
		tone: {
			ink: 'bg-journ-ink text-journ-paper',
			indigo: 'bg-journ-indigo text-journ-ink',
			mint: 'bg-journ-mint text-journ-ink',
			sky: 'bg-journ-sky text-journ-ink',
			yellow: 'bg-journ-yellow text-journ-ink',
			coral: 'bg-journ-coral text-journ-ink',
		},
	},
	defaultVariants: { tone: 'ink' },
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
