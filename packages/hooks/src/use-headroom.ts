import { clamp } from '@thom/utils/clamp'
import { useEffectEvent, useRef, useState } from 'react'
import { useIsomorphicEffect } from './use-isomorphic-effect'
import { useScrollDirection } from './use-scroll-direction'
import { useWindowScroll } from './use-window-scroll'

type UseHeadroomInput = {
	fixedAt?: number
	scrollDistance?: number
	onPin?: () => void
	onFix?: () => void
	onRelease?: () => void
}

type UseHeadroomReturnValue = {
	pinned: boolean
	scrollProgress: number
}

type Anchor = {
	fixed: boolean
	isScrollingUp: boolean
	scrollY: number
	progress: number
}

const isFixed = (current: number, fixedAt: number) => current <= fixedAt
const isPinned = (current: number, previous: number) => current <= previous
const isReleased = (current: number, previous: number, fixedAt: number) =>
	!isPinned(current, previous) && !isFixed(current, fixedAt)

const progressFrom = ({ isScrollingUp, scrollY, progress }: Anchor, scrollPosition: number, scrollDistance: number) => {
	const delta = Math.abs(scrollPosition - scrollY) / scrollDistance
	return clamp(progress + (isScrollingUp ? delta : -delta), 0, 1)
}

const advanceAnchor = (
	anchor: Anchor,
	scrollPosition: number,
	fixedAt: number,
	isScrollingUp: boolean,
	scrollDistance: number,
): Anchor => {
	const fixed = isFixed(scrollPosition, fixedAt)

	if (anchor.fixed !== fixed) {
		return { fixed, isScrollingUp, scrollY: fixed ? scrollPosition : fixedAt, progress: 1 }
	}

	if (!fixed && anchor.isScrollingUp !== isScrollingUp) {
		return {
			fixed,
			isScrollingUp,
			scrollY: scrollPosition,
			progress: progressFrom(anchor, scrollPosition, scrollDistance),
		}
	}

	return anchor
}

const useHeadroom = ({
	fixedAt = 0,
	scrollDistance = 100,
	onPin,
	onFix,
	onRelease,
}: UseHeadroomInput = {}): UseHeadroomReturnValue => {
	const isScrollingUp = useScrollDirection() === 'up'
	const [{ y: scrollPosition }] = useWindowScroll()
	const fixed = isFixed(scrollPosition, fixedAt)

	const [anchor, setAnchor] = useState<Anchor>({
		fixed,
		isScrollingUp,
		scrollY: scrollPosition,
		progress: fixed ? 1 : 0,
	})

	const currentAnchor = advanceAnchor(anchor, scrollPosition, fixedAt, isScrollingUp, scrollDistance)
	if (currentAnchor !== anchor) {
		setAnchor(currentAnchor)
	}

	const scrollProgress = fixed ? 1 : progressFrom(currentAnchor, scrollPosition, scrollDistance)

	const pinnedRef = useRef(false)
	const onPinEvent = useEffectEvent(() => onPin?.())
	const onReleaseEvent = useEffectEvent(() => onRelease?.())
	const onFixEvent = useEffectEvent(() => onFix?.())

	useIsomorphicEffect(() => {
		const shouldBePinned = fixed || isScrollingUp

		if (shouldBePinned === pinnedRef.current) {
			return
		}

		pinnedRef.current = shouldBePinned
		if (shouldBePinned) {
			onPinEvent()
		} else {
			onReleaseEvent()
		}
	}, [fixed, isScrollingUp])

	useIsomorphicEffect(() => {
		if (fixed) {
			onFixEvent()
		}
	}, [fixed])

	return { pinned: scrollProgress > 0, scrollProgress }
}

export { isFixed, isPinned, isReleased, useHeadroom }

export type { UseHeadroomInput, UseHeadroomReturnValue }
