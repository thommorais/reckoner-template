'use client'

import { useEffect, type ComponentPropsWithRef, type ReactNode } from 'react'
import { ContextProvider } from './combobox-parts'
import { Content as DialogContent, Root as DialogRoot, Title as DialogTitle, Trigger } from './dialog-parts'
import { cn } from './lib/cn'
import { displayTitle } from './lib/text-styles'
import { useControllableState } from './lib/use-controllable-state'

type RootProps = {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	/** Runs when an item is chosen, with the item's `value`. The palette closes after. */
	onSelect?: (value: string) => void
	/** Letter pressed with Cmd or Ctrl to toggle the palette. Pass an empty string to disable. */
	shortcut?: string
	children?: ReactNode
}

/** A dialog that hosts the combobox list parts, opened globally with a keyboard shortcut. */
const Root = ({ open, defaultOpen = false, onOpenChange, onSelect, shortcut = 'k', children }: RootProps) => {
	const [current, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange)
	const isOpen = current ?? false

	useEffect(() => {
		if (!shortcut) return
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut.toLowerCase()) {
				event.preventDefault()
				setOpen(!isOpen)
			}
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [shortcut, isOpen, setOpen])

	return (
		<ContextProvider
			state={{ value: null, open: isOpen }}
			actions={{
				setOpen,
				select: value => {
					onSelect?.(value)
					setOpen(false)
				},
			}}
		>
			<DialogRoot open={isOpen} onOpenChange={setOpen}>
				{children}
			</DialogRoot>
		</ContextProvider>
	)
}

type ContentProps = ComponentPropsWithRef<typeof DialogContent> & {
	/** Read by screen readers only. */
	title?: string
}

const Content = ({ title = 'Command palette', className, children, ...props }: ContentProps) => (
	<DialogContent aria-describedby={undefined} {...props} className={cn('p-3', className)}>
		<DialogTitle className={cn(displayTitle, 'sr-only')}>{title}</DialogTitle>
		{children}
	</DialogContent>
)

export { Root, Trigger, Content }
export type { RootProps }
