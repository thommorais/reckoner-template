import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { surfaceTones } from './lib/tones'
import { tv, type VariantProps } from './lib/tv'

const alertRoot = tv({
	base: 'rounded-journ flex items-start gap-3 p-4',
	variants: { tone: surfaceTones },
	defaultVariants: { tone: 'dark' },
})

type RootProps = ComponentPropsWithRef<'div'> & VariantProps<typeof alertRoot>

const Root = ({ tone, className, ...props }: RootProps) => (
	<div data-slot='alert' role='alert' {...props} className={alertRoot({ tone, class: className })} />
)

const Icon = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='alert-icon' aria-hidden {...props} className={cn('mt-0.5 shrink-0 [&>svg]:size-5', className)} />
)

const Body = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='alert-body' {...props} className={cn('flex min-w-0 flex-1 flex-col gap-1', className)} />
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p
		data-slot='alert-title'
		{...props}
		className={cn('font-journ-display text-xl/none font-semibold uppercase', className)}
	/>
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='alert-description' {...props} className={cn('text-sm/5 opacity-80', className)} />
)

const Actions = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='alert-actions' {...props} className={cn('mt-2 flex items-center gap-2', className)} />
)

const Alert = { Root, Icon, Body, Title, Description, Actions }

export { Alert }
export type { RootProps as AlertProps }
