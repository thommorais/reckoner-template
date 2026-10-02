import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTable, dataTableColumns, selectColumn, useDataTable } from './data-table'

type Row = { id: string; name: string; amount: number }

const rows: Row[] = [
	{ id: 'a', name: 'Prime cost', amount: 30 },
	{ id: 'b', name: 'Menu mix', amount: 10 },
	{ id: 'c', name: 'Labor', amount: 20 },
	{ id: 'd', name: 'Weekly', amount: 40 },
	{ id: 'e', name: 'Inventory', amount: 5 },
]

const column = dataTableColumns<Row>()
const columns = column.columns([
	selectColumn<Row>(),
	column.accessor('name', { header: 'Name' }),
	column.accessor('amount', { header: 'Amount' }),
])

const renderTable = (props: Partial<Parameters<typeof DataTable.Root<Row>>[0]> = {}) =>
	render(
		<DataTable.Root data={rows} columns={columns} getRowId={row => row.id} {...props}>
			<DataTable.Toolbar>
				<DataTable.ColumnPicker />
			</DataTable.Toolbar>
			<DataTable.Table empty='Nothing here' />
			<DataTable.Pager />
			<DataTable.SelectionBar />
		</DataTable.Root>,
	)

const names = () =>
	screen
		.getAllByRole('row')
		.slice(1)
		.map(row => within(row).queryAllByRole('cell')[1]?.textContent)

const sortButton = (label: string) => screen.getByRole('button', { name: label })
const header = (label: string) => screen.getByRole('columnheader', { name: label })

describe('DataTable', () => {
	it('renders the headers and rows', () => {
		renderTable()

		expect(screen.getByRole('columnheader', { name: 'Name' })).toBeTruthy()
		expect(names()).toEqual(['Prime cost', 'Menu mix', 'Labor', 'Weekly', 'Inventory'])
	})

	describe('sorting', () => {
		it('cycles through both directions, then back to the original order', () => {
			renderTable()

			// Numbers sort largest first, like TanStack's default for numeric columns.
			fireEvent.click(sortButton('Amount'))
			expect(header('Amount').getAttribute('aria-sort')).toBe('descending')
			expect(names()).toEqual(['Weekly', 'Prime cost', 'Labor', 'Menu mix', 'Inventory'])

			fireEvent.click(sortButton('Amount'))
			expect(header('Amount').getAttribute('aria-sort')).toBe('ascending')
			expect(names()).toEqual(['Inventory', 'Menu mix', 'Labor', 'Prime cost', 'Weekly'])

			fireEvent.click(sortButton('Amount'))
			expect(header('Amount').getAttribute('aria-sort')).toBe('none')
			expect(names()).toEqual(['Prime cost', 'Menu mix', 'Labor', 'Weekly', 'Inventory'])
		})

		it('starts sorted when asked and leaves the checkbox column unsortable', () => {
			renderTable({ initialSorting: [{ id: 'name', desc: false }] })

			expect(header('Name').getAttribute('aria-sort')).toBe('ascending')
			expect(names()[0]).toBe('Inventory')
			expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeTruthy()
			expect(screen.queryByRole('button', { name: 'Select all rows' })).toBeNull()
			expect(screen.getAllByRole('columnheader')[0]?.getAttribute('aria-sort')).toBeNull()
		})
	})

	describe('selection', () => {
		it('shows the selection bar with a count and reports the rows', () => {
			const onSelectionChange = vi.fn()
			renderTable({ onSelectionChange })
			expect(screen.queryByRole('toolbar')).toBeNull()

			fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[1]!)

			expect(screen.getByText('1 selected')).toBeTruthy()
			expect(onSelectionChange).toHaveBeenLastCalledWith([rows[1]])
		})

		it('selects every row on the page with select all, then clears', () => {
			renderTable()

			fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }))
			expect(screen.getByText('5 selected')).toBeTruthy()

			fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
			expect(screen.queryByText('5 selected')).toBeNull()
		})

		it('marks select all as mixed while only some rows are selected', () => {
			renderTable()

			fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!)

			expect(screen.getByRole('checkbox', { name: 'Select all rows' }).getAttribute('aria-checked')).toBe('mixed')
		})
	})

	describe('column visibility', () => {
		it('hides and shows a column from the picker, but not the checkbox column', () => {
			renderTable()

			fireEvent.click(screen.getByRole('button', { name: 'Columns' }))
			const options = screen.getAllByRole('checkbox').filter(box => box.closest('label'))
			expect(options.map(box => box.closest('label')?.textContent)).toEqual(['Name', 'Amount'])

			fireEvent.click(screen.getByRole('checkbox', { name: 'Amount' }))
			expect(screen.queryByRole('columnheader', { name: 'Amount' })).toBeNull()

			fireEvent.click(screen.getByRole('checkbox', { name: 'Amount' }))
			expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeTruthy()
		})
	})

	describe('pagination', () => {
		it('pages through the rows', () => {
			renderTable({ pageSize: 2 })

			expect(screen.getByText('Page 1 of 3')).toBeTruthy()
			expect(names()).toEqual(['Prime cost', 'Menu mix'])
			expect(screen.getByRole('button', { name: 'Previous' }).hasAttribute('disabled')).toBe(true)

			fireEvent.click(screen.getByRole('button', { name: 'Next' }))
			expect(screen.getByText('Page 2 of 3')).toBeTruthy()
			expect(names()).toEqual(['Labor', 'Weekly'])

			fireEvent.click(screen.getByRole('button', { name: 'Next' }))
			expect(names()).toEqual(['Inventory'])
			expect(screen.getByRole('button', { name: 'Next' }).hasAttribute('disabled')).toBe(true)

			fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
			expect(screen.getByText('Page 2 of 3')).toBeTruthy()
		})

		it('sorts across pages', () => {
			renderTable({ pageSize: 2 })

			fireEvent.click(sortButton('Amount'))

			expect(names()).toEqual(['Weekly', 'Prime cost'])
		})
	})

	it('shows the empty state when there are no rows', () => {
		renderTable({ data: [] })

		expect(screen.getByText('Nothing here')).toBeTruthy()
		expect(screen.getByText('Page 1 of 1')).toBeTruthy()
	})

	it('rejects parts and hooks outside the root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const Probe = () => (useDataTable(), null)

		expect(() => render(<Probe />)).toThrow('DataTable.Root')
		expect(() => render(<DataTable.Pager />)).toThrow('DataTable.Root')

		spy.mockRestore()
	})
})
