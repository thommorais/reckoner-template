import { useMemo, useRef, useState } from 'react'

const useMap = <K, V>(initialState?: [K, V][]): Map<K, V> => {
	const [map, setMap] = useState(() => new Map<K, V>(initialState))
	const latest = useRef(map)

	return useMemo(() => {
		const view = new Map(map)

		const commit = (next: Map<K, V>) => {
			latest.current = next
			setMap(next)
		}

		view.set = (key, value) => {
			commit(new Map(latest.current).set(key, value))
			return view
		}

		view.delete = key => {
			const existed = latest.current.has(key)
			if (existed) {
				const next = new Map(latest.current)
				next.delete(key)
				commit(next)
			}
			return existed
		}

		view.clear = () => commit(new Map())

		return view
	}, [map])
}

export { useMap }
