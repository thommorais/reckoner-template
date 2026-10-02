import type { animate } from 'animejs'
import type { ComponentPropsWithRef, ElementType } from 'react'
import { modalOverlay } from './overlay'
import { useEnter, useOverlayEnter } from './use-enter'

type ModalPrimitive = { Portal: ElementType; Overlay: ElementType; Content: ElementType }

/** Opens in a portal over a dimmed, fading overlay. The panel animates in with `enter`. */
const ModalContent = <P extends ModalPrimitive>({
	primitive,
	slot,
	enter,
	...props
}: ComponentPropsWithRef<P['Content']> & {
	primitive: P
	/** Prefixes each `data-slot`, e.g. `dialog` gives `dialog` and `dialog-overlay`. */
	slot: string
	enter: Parameters<typeof animate>[1]
}) => {
	const overlay = useOverlayEnter()
	const panel = useEnter<HTMLDivElement>(enter)
	const { Portal, Overlay, Content } = primitive

	return (
		<Portal>
			<Overlay ref={overlay} data-slot={`${slot}-overlay`} className={modalOverlay} />
			<Content ref={panel} data-slot={slot} {...props} />
		</Portal>
	)
}

export { ModalContent }
