import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react'

const dependenciesChanged = (previous: DependencyList, next: DependencyList) =>
	previous.length !== next.length || next.some((dep, index) => !Object.is(dep, previous[index]))

const useDidUpdate = (fn: EffectCallback, dependencies?: DependencyList) => {
	const mounted = useRef(false)
	const previousRender = useRef<object>(null)
	const previousDependencies = useRef<DependencyList | undefined>(undefined)
	const render = {}

	useEffect(() => {
		const isSameRender = previousRender.current === render
		const previous = previousDependencies.current

		previousRender.current = render
		previousDependencies.current = dependencies

		if (!mounted.current) {
			mounted.current = true
			return undefined
		}

		if (isSameRender) {
			return undefined
		}

		if (dependencies && previous && !dependenciesChanged(previous, dependencies)) {
			return undefined
		}

		return fn()
		// oxlint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies)
}

export { useDidUpdate }
