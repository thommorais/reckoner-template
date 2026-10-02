'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
	children: ReactNode
	/** Where to render. Defaults to `document.body`. */
	container?: Element | null
}

/**
 * Renders its children outside the current tree, so a sticky or clipped parent
 * cannot trap them. Waits for the client, so it renders nothing on the server.
 * Radix overlays already portal themselves; use this for your own floating UI.
 */
const Portal = ({ children, container }: PortalProps) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	if (!mounted) return null

	return createPortal(children, container ?? document.body)
}

export { Portal }
export type { PortalProps }
