import { useMemo } from 'react'
import { useUncontrolled } from './use-uncontrolled'

const DOTS = '...' as const

type PaginationItem = number | typeof DOTS

type UsePaginationOptions = {
	initialPage?: number
	page?: number
	total: number
	siblings?: number
	boundaries?: number
	onChange?: (page: number) => void
}

type UsePaginationReturnValue = {
	range: PaginationItem[]
	active: number
	setPage: (page: number) => void
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => index + start)

const usePagination = ({
	total,
	siblings = 1,
	boundaries = 1,
	page,
	initialPage = 1,
	onChange,
}: UsePaginationOptions): UsePaginationReturnValue => {
	const totalPages = Math.max(Math.trunc(total), 0)
	const [activePage, setPage] = useUncontrolled({
		value: page,
		defaultValue: initialPage,
		finalValue: initialPage,
		onChange,
	})

	const paginationRange = useMemo((): PaginationItem[] => {
		const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
		if (totalPageNumbers >= totalPages) {
			return range(1, totalPages)
		}

		const leftSiblingIndex = Math.max(activePage - siblings, boundaries)
		const rightSiblingIndex = Math.min(activePage + siblings, totalPages - boundaries)

		const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
		const shouldShowRightDots = rightSiblingIndex < totalPages - (boundaries + 1)

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = siblings * 2 + boundaries + 2
			return [...range(1, leftItemCount), DOTS, ...range(totalPages - (boundaries - 1), totalPages)]
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = boundaries + 1 + 2 * siblings
			return [...range(1, boundaries), DOTS, ...range(totalPages - rightItemCount, totalPages)]
		}

		return [
			...range(1, boundaries),
			DOTS,
			...range(leftSiblingIndex, rightSiblingIndex),
			DOTS,
			...range(totalPages - boundaries + 1, totalPages),
		]
	}, [totalPages, siblings, activePage, boundaries])

	return { range: paginationRange, active: activePage, setPage }
}

export { DOTS, usePagination }
