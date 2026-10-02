'use client'

import { Badge, type BadgeProps } from 'journ/badge'
import { Button } from 'journ/button'
import { DataTable, dataTableColumns, selectColumn } from 'journ/data-table'
import { Toast } from 'journ/toast'

type Transaction = {
	id: string
	vendor: string
	category: string
	status: 'Cleared' | 'Pending' | 'Flagged'
	amount: number
}

const transactions: Transaction[] = [
	{ id: '1', vendor: 'Sysco', category: 'Food', status: 'Cleared', amount: 4820.5 },
	{ id: '2', vendor: 'Blue Bottle', category: 'Beverage', status: 'Cleared', amount: 912.4 },
	{ id: '3', vendor: 'ConEd', category: 'Utilities', status: 'Pending', amount: 1340 },
	{ id: '4', vendor: 'Gusto payroll', category: 'Labor', status: 'Flagged', amount: 18250 },
	{ id: '5', vendor: 'Restaurant Depot', category: 'Food', status: 'Cleared', amount: 2210.75 },
	{ id: '6', vendor: 'Square fees', category: 'Fees', status: 'Cleared', amount: 486.2 },
	{ id: '7', vendor: 'Landlord', category: 'Rent', status: 'Pending', amount: 9500 },
	{ id: '8', vendor: 'Hudson Linen', category: 'Supplies', status: 'Cleared', amount: 320 },
	{ id: '9', vendor: 'Local Farms', category: 'Food', status: 'Flagged', amount: 1475.3 },
	{ id: '10', vendor: 'Insurance', category: 'Fees', status: 'Cleared', amount: 640 },
	{ id: '11', vendor: 'Pest control', category: 'Supplies', status: 'Pending', amount: 180 },
	{ id: '12', vendor: 'Coffee Co-op', category: 'Beverage', status: 'Cleared', amount: 735.9 },
]

const tones = { Cleared: 'mint', Pending: 'yellow', Flagged: 'coral' } as const satisfies Record<
	Transaction['status'],
	BadgeProps['tone']
>

const column = dataTableColumns<Transaction>()

const columns = column.columns([
	selectColumn<Transaction>(),
	column.accessor('vendor', { header: 'Vendor', cell: info => <span className='font-medium'>{info.getValue()}</span> }),
	column.accessor('category', { header: 'Category' }),
	column.accessor('status', {
		header: 'Status',
		cell: info => <Badge tone={tones[info.getValue()]}>{info.getValue()}</Badge>,
	}),
	column.accessor('amount', {
		header: 'Amount',
		cell: info => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(info.getValue()),
	}),
])

const DataTableDemo = () => (
	<DataTable.Root data={transactions} columns={columns} getRowId={row => row.id} pageSize={5}>
		<DataTable.Toolbar>
			<DataTable.ColumnPicker />
		</DataTable.Toolbar>
		<DataTable.Table />
		<DataTable.Pager />
		<DataTable.SelectionBar>
			<Button tone='coral' onClick={() => Toast.show('Archived')}>
				Archive
			</Button>
		</DataTable.SelectionBar>
	</DataTable.Root>
)

export { DataTableDemo }
