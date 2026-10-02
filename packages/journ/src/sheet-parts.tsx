'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { ComponentPropsWithRef } from 'react'
import { Actions, Body, Close, Description, Root, Title, Trigger } from './dialog-parts'
import { ModalContent } from './lib/modal-content'
import { surfaceFill } from './lib/theme'
import { tv, type VariantProps } from './lib/tv'

type Side = 'top' | 'right' | 'bottom' | 'left'

const sheetContent = tv({
	base: [surfaceFill, 'fixed flex flex-col gap-4 p-5 outline-none'],
	variants: {
		side: {
			right: 'rounded-l-journ inset-y-0 right-0 w-[calc(100%-2rem)] max-w-sm',
			left: 'rounded-r-journ inset-y-0 left-0 w-[calc(100%-2rem)] max-w-sm',
			top: 'rounded-b-journ inset-x-0 top-0 max-h-[85dvh]',
			bottom: 'rounded-t-journ inset-x-0 bottom-0 max-h-[85dvh]',
		},
	},
	defaultVariants: { side: 'right' },
})

/** Where the panel starts, so it slides in from its own edge. */
const slideFrom: Record<Side, { translateX?: string[]; translateY?: string[] }> = {
	right: { translateX: ['100%', '0%'] },
	left: { translateX: ['-100%', '0%'] },
	top: { translateY: ['-100%', '0%'] },
	bottom: { translateY: ['100%', '0%'] },
}

type ContentProps = ComponentPropsWithRef<typeof RadixDialog.Content> & VariantProps<typeof sheetContent>

const Content = ({ side = 'right', className, ...props }: ContentProps) => (
	<ModalContent
		primitive={RadixDialog}
		slot='sheet'
		enter={{ ...slideFrom[side ?? 'right'], duration: 300, ease: 'outExpo' }}
		data-side={side}
		{...props}
		className={sheetContent({ side, class: className })}
	/>
)

export { Root, Trigger, Close, Content, Title, Description, Body, Actions }
export type { ContentProps as SheetContentProps, Side as SheetSide }
