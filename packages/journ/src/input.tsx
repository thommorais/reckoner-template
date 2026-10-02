import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { controlSize, fieldRing, fieldText } from './lib/text-styles'

const field = `block w-full bg-current/10 px-4 ${controlSize} ${fieldText} ${fieldRing}`

const Input = ({ className, ...props }: ComponentPropsWithRef<'input'>) => (
	<input data-slot='input' {...props} className={cn(field, 'rounded-full', className)} />
)

export { Input, field }
