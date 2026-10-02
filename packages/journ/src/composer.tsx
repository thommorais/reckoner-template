import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		data-slot='composer'
		{...props}
		className={cn(
			'flex items-center gap-2 rounded-full bg-journ-paper/10 p-1.5 text-journ-paper has-[:disabled]:opacity-50 sm:focus-within:outline-2 sm:focus-within:outline-journ-sky',
			className,
		)}
	/>
)

const Input = ({ className, ...props }: ComponentPropsWithRef<'input'>) => (
	<input
		data-slot='composer-input'
		{...props}
		className={cn(
			'min-w-0 flex-1 scheme-dark bg-transparent px-3 py-1.5 text-base/6 outline-none placeholder:text-journ-paper/50 aria-invalid:text-journ-coral sm:text-sm/6',
			className,
		)}
	/>
)

const Composer = { Root, Input }

export { Composer }
