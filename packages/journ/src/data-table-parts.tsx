'use client'

import {
	columnVisibilityFeature,
	createColumnHelper,
	createPaginatedRowModel,
	createSortedRowModel,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
	type Column,
	type ColumnDef,
	type Header,
	type ReactTable,
	type RowData,
	type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Columns3 } from 'lucide-react'
import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { BulkBar } from './bulk-bar'
import { Button } from './button'
import { Indicator as CheckboxIndicator, Root as CheckboxRoot } from './checkbox-parts'
import { cn } from './lib/cn'
import { createRequiredContext } from './lib/required-context'
import { Content as PopoverContent, Root as PopoverRoot, Trigger as PopoverTrigger } from './popover-parts'
import { Pagination } from './pagination'
import { Table } from './table'

/** The table features journ turns on. Declared once so every part sees the same types. */
const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	rowSelectionFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
})
type Features = typeof features

type DataTableColumn<TData extends RowData> = ColumnDef<Features, TData>

/** Typed helper for building columns: `const column = dataTableColumns<Row>()`. */
const dataTableColumns = <TData extends RowData>() => createColumnHelper<Features, TData>()

// The context value changes with the table state, so every part re-renders when it does.
// oxlint-disable-next-line typescript/no-explicit-any -- the row type is only known to the caller
type Shared = { table: ReactTable<Features, any>; state: unknown }
const [DataTableContext, useShared] = createRequiredContext<Shared>('DataTable.Root')

const useDataTableInstance = () => useShared().table

/** The TanStack table instance, for custom parts such as a search box or a footer. */
const useDataTable = <TData extends RowData>() => useShared().table as ReactTable<Features, TData>

type RootProps<TData extends RowData> = {
	data: TData[]
	// oxlint-disable-next-line typescript/no-explicit-any -- column value types differ per column
	columns: ColumnDef<Features, TData, any>[]
	pageSize?: number
	getRowId?: (row: TData, index: number) => string
	initialSorting?: SortingState
	/** Fires with the selected rows whenever the selection changes. */
	onSelectionChange?: (rows: TData[]) => void
	children?: ReactNode
}

/** Owns sorting, selection, column visibility and paging, and shares the table with its parts. */
const Root = <TData extends RowData>({
	data,
	columns,
	pageSize = 10,
	getRowId,
	initialSorting = [],
	onSelectionChange,
	children,
}: RootProps<TData>) => {
	const table = useTable(
		{
			features,
			data,
			columns,
			getRowId,
			initialState: { sorting: initialSorting, pagination: { pageIndex: 0, pageSize } },
		},
		state => state,
	)
	const { rowSelection } = table.state

	const mounted = useRef(false)
	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		onSelectionChange?.(table.getSelectedRowModel().flatRows.map(row => row.original))
	}, [rowSelection])

	return (
		<DataTableContext value={{ table: table as unknown as Shared['table'], state: table.state }}>
			{children}
		</DataTableContext>
	)
}

const Toolbar = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='data-table-toolbar' {...props} className={cn('flex flex-wrap items-center gap-2', className)} />
)

const sortLabel = { asc: 'ascending', desc: 'descending' } as const

const HeaderCell = <TData extends RowData>({ header }: { header: Header<Features, TData, unknown> }) => {
	const table = useDataTableInstance()
	const { column } = header
	const sorted = column.getIsSorted()
	const content = header.isPlaceholder ? null : <table.FlexRender header={header} />

	return (
		<Table.Header aria-sort={column.getCanSort() ? (sorted ? sortLabel[sorted] : 'none') : undefined}>
			{column.getCanSort() ? (
				<button
					type='button'
					onClick={column.getToggleSortingHandler()}
					className='focus-visible:outline-journ-sky inline-flex cursor-default items-center gap-1 uppercase outline-none focus-visible:outline-2'
				>
					{content}
					{sorted === 'asc' ? (
						<ArrowUp className='size-3' />
					) : sorted === 'desc' ? (
						<ArrowDown className='size-3' />
					) : (
						<ChevronsUpDown className='size-3 opacity-50' />
					)}
				</button>
			) : (
				content
			)}
		</Table.Header>
	)
}

type TableViewProps = ComponentPropsWithRef<typeof Table.Root> & {
	/** Shown in place of the rows when there are none. */
	empty?: ReactNode
}

/** Renders the header, rows and cells from the table state with the journ Table parts. */
const View = ({ empty = 'No results', ...props }: TableViewProps) => {
	const table = useDataTableInstance()
	const rows = table.getRowModel().rows

	return (
		<Table.Root {...props}>
			<Table.Head>
				{table.getHeaderGroups().map(group => (
					<Table.Row key={group.id}>
						{group.headers.map(header => (
							<HeaderCell key={header.id} header={header} />
						))}
					</Table.Row>
				))}
			</Table.Head>
			<Table.Body>
				{rows.length > 0 ? (
					rows.map(row => (
						<Table.Row
							key={row.id}
							data-state={row.getIsSelected() ? 'selected' : undefined}
							className='data-[state=selected]:bg-journ-sky/15'
						>
							{row.getVisibleCells().map(cell => (
								<Table.Cell key={cell.id}>
									<table.FlexRender cell={cell} />
								</Table.Cell>
							))}
						</Table.Row>
					))
				) : (
					<Table.Row>
						<Table.Cell colSpan={table.getVisibleLeafColumns().length} className='py-10 text-center opacity-70'>
							{empty}
						</Table.Cell>
					</Table.Row>
				)}
			</Table.Body>
		</Table.Root>
	)
}

/** A checkbox column with select all for the current page. Put it first in `columns`. */
const selectColumn = <TData extends RowData>(): DataTableColumn<TData> => ({
	id: 'select',
	enableSorting: false,
	enableHiding: false,
	header: ({ table }) => (
		<CheckboxRoot
			aria-label='Select all rows'
			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
			onCheckedChange={checked => table.toggleAllPageRowsSelected(checked === true)}
		>
			<CheckboxIndicator />
		</CheckboxRoot>
	),
	cell: ({ row }) => (
		<CheckboxRoot
			aria-label='Select row'
			checked={row.getIsSelected()}
			onCheckedChange={checked => row.toggleSelected(checked === true)}
		>
			<CheckboxIndicator />
		</CheckboxRoot>
	),
})

const columnLabel = <TData extends RowData>(column: Column<Features, TData, unknown>) =>
	typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id

/** A popover with one checkbox per hideable column. Children replace the default trigger label. */
const ColumnPicker = ({ children = 'Columns' }: { children?: ReactNode }) => {
	const table = useDataTableInstance()
	const columns = table.getAllLeafColumns().filter(column => column.getCanHide())

	return (
		<PopoverRoot>
			<PopoverTrigger asChild>
				<Button tone='outline'>
					<Columns3 />
					{children}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='start' className='w-56 gap-1'>
				{columns.map(column => (
					<label key={column.id} className='flex items-center gap-3 rounded-xl px-2 py-2 text-sm'>
						<CheckboxRoot
							checked={column.getIsVisible()}
							onCheckedChange={visible => column.toggleVisibility(visible === true)}
						>
							<CheckboxIndicator />
						</CheckboxRoot>
						{columnLabel(column)}
					</label>
				))}
			</PopoverContent>
		</PopoverRoot>
	)
}

/** Previous and next with the current page. Uses buttons, since paging stays on the page. */
const Pager = ({ className, ...props }: ComponentPropsWithRef<typeof Pagination.Root>) => {
	const table = useDataTableInstance()
	const { pageIndex } = table.state.pagination

	return (
		<Pagination.Root aria-label='Table pagination' {...props} className={className}>
			<Button tone='ghost' disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
				<ChevronLeft />
				Previous
			</Button>
			<span aria-live='polite' className='text-sm tabular-nums'>
				Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
			</span>
			<Button tone='ghost' disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
				Next
				<ChevronRight />
			</Button>
		</Pagination.Root>
	)
}

/** Appears while rows are selected. Children are the bulk actions. */
const SelectionBar = ({ children, ...props }: ComponentPropsWithRef<typeof BulkBar.Root>) => {
	const table = useDataTableInstance()
	const count = table.getSelectedRowModel().rows.length
	if (count === 0) return null

	return (
		<BulkBar.Root {...props}>
			<BulkBar.Count>{count} selected</BulkBar.Count>
			<BulkBar.Actions>
				{children}
				<Button tone='ghost' onClick={() => table.resetRowSelection()}>
					Clear
				</Button>
			</BulkBar.Actions>
		</BulkBar.Root>
	)
}

export { Root, Toolbar, ColumnPicker, View, Pager, SelectionBar, dataTableColumns, selectColumn, useDataTable }
export type { DataTableColumn, RootProps, TableViewProps }
