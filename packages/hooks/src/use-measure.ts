import { useCallback, useRef, useState } from 'react'

type Dimensions = {
	width: number | null
	height: number | null
}

const EMPTY: Dimensions = { width: null, height: null }

const useMeasure = (): [(node: Element | null) => void, Dimensions] => {
	const [dimensions, setDimensions] = useState<Dimensions>(EMPTY)
	const observerRef = useRef<ResizeObserver | null>(null)

	const ref = useCallback((node: Element | null) => {
		observerRef.current?.disconnect()
		observerRef.current = null

		if (node?.nodeType !== Node.ELEMENT_NODE) {
			return
		}

		const observer = new ResizeObserver(([entry]) => {
			if (!entry?.borderBoxSize) {
				return
			}

			const box = entry.borderBoxSize[0]
			setDimensions(box ? { width: box.inlineSize, height: box.blockSize } : EMPTY)
		})

		observer.observe(node)
		observerRef.current = observer
	}, [])

	return [ref, dimensions]
}

export { useMeasure }
