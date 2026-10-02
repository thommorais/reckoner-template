'use client'

import * as RadixOtp from '@radix-ui/react-one-time-password-field'
import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'
import { fieldRing, fieldText } from './lib/text-styles'

const Root = ({ className, ...props }: ComponentPropsWithRef<typeof RadixOtp.Root>) => (
	<RadixOtp.Root data-slot='otp-input' {...props} className={cn('flex items-center gap-2', className)} />
)

/** One box per character. Render as many as the code is long. */
const Slot = ({ className, ...props }: ComponentPropsWithRef<typeof RadixOtp.Input>) => (
	<RadixOtp.Input
		data-slot='otp-input-slot'
		{...props}
		className={cn(
			fieldText,
			fieldRing,
			'size-12 rounded-2xl bg-current/10 text-center font-mono text-xl tabular-nums',
			className,
		)}
	/>
)

/** Submits the whole code with a surrounding form. Render it once, after the slots. */
const Hidden = RadixOtp.HiddenInput

export { Root, Slot, Hidden }
