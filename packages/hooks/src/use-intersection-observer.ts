import { useCallback, useEffect, useEffectEvent, useState } from 'react'

type State = {
	isIntersecting: boolean
	entry?: IntersectionObserverEntry
}

type UseIntersectionObserverOptions = {
	root?: Element | Document | null
	rootMargin?: string
	threshold?: number | number[]
	freezeOnceVisible?: boolean
	onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
	initialIsIntersecting?: boolean
}

type IntersectionReturn = [(node?: Element | null) => void, boolean, IntersectionObserverEntry | undefined] & {
	ref: (node?: Element | null) => void
	isIntersecting: boolean
	entry?: IntersectionObserverEntry
}

const checkIntersecting = (entry: IntersectionObserverEntry, thresholds: readonly number[]): boolean =>
	entry.isIntersecting && thresholds.some(threshold => entry.intersectionRatio >= threshold)

const useIntersectionObserver = ({
	threshold = 0,
	root = null,
	rootMargin = '0%',
	freezeOnceVisible = false,
	initialIsIntersecting = false,
	onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn => {
	const [node, setNode] = useState<Element | null>(null)
	const [state, setState] = useState<State>({ isIntersecting: initialIsIntersecting })

	const notify = useEffectEvent((isIntersecting: boolean, entry: IntersectionObserverEntry) =>
		onChange?.(isIntersecting, entry),
	)

	const frozen = freezeOnceVisible && state.entry?.isIntersecting === true
	const thresholdKey = [threshold].flat().join(',')

	useEffect(() => {
		if (!node || frozen || !('IntersectionObserver' in window)) {
			return
		}

		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					const isIntersecting = checkIntersecting(entry, observer.thresholds)
					setState({ isIntersecting, entry })
					notify(isIntersecting, entry)
				}
			},
			{ threshold: thresholdKey.split(',').map(Number), root, rootMargin },
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [node, frozen, thresholdKey, root, rootMargin])

	const ref = useCallback(
		(next?: Element | null) => {
			setNode(next ?? null)
			if (!next && !freezeOnceVisible) {
				setState({ isIntersecting: initialIsIntersecting })
			}
		},
		[freezeOnceVisible, initialIsIntersecting],
	)

	return Object.assign([ref, state.isIntersecting, state.entry] as const, {
		ref,
		isIntersecting: state.isIntersecting,
		entry: state.entry,
	}) as unknown as IntersectionReturn
}

export { useIntersectionObserver }
