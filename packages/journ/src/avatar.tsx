import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span
		data-slot='avatar'
		{...props}
		className={cn(
			'grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-journ-yellow text-journ-ink',
			className,
		)}
	/>
)

const Image = ({ className, alt, ...props }: ComponentPropsWithRef<'img'> & { alt: string }) => (
	<img data-slot='avatar-image' alt={alt} {...props} className={cn('size-full object-cover', className)} />
)

const Fallback = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span data-slot='avatar-fallback' {...props} className={cn('text-sm font-semibold uppercase', className)} />
)

const Avatar = { Root, Image, Fallback }

export { Avatar }
