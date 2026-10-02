import {
	ColumnPicker,
	Pager,
	Root,
	SelectionBar,
	Toolbar,
	View,
	dataTableColumns,
	selectColumn,
	useDataTable,
} from './data-table-parts'

const DataTable = { Root, Toolbar, ColumnPicker, Table: View, Pager, SelectionBar }

export { DataTable, dataTableColumns, selectColumn, useDataTable }
export type { DataTableColumn, RootProps as DataTableProps } from './data-table-parts'
