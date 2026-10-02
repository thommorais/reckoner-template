import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const field =
	'block w-full scheme-dark bg-current/10 px-4 py-2.5 text-base/6 outline-none placeholder:text-current/50 sm:py-1.5 sm:text-sm/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky aria-invalid:outline-2 aria-invalid:outline-journ-coral disabled:opacity-50'

const Input = ({ className, ...props }: ComponentPropsWithRef<'input'>) => (
	<input data-slot='input' {...props} className={cn(field, 'rounded-full', className)} />
)

export { Input, field }
