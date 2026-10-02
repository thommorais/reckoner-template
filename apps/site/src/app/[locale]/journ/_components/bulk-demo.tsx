'use client'

import { BulkBar } from 'journ/bulk-bar'
import { Button } from 'journ/button'
import { Checkbox } from 'journ/checkbox'
import { useState } from 'react'

const rows = ['Prime cost report', 'Menu mix', 'Stabilizing labor cost', 'Weekly revenue']

const BulkDemo = () => {
	const [selected, setSelected] = useState<string[]>(['Menu mix'])

	return (
		<>
			<div className='flex flex-col gap-3'>
				{rows.map(row => (
					<label key={row} className='flex items-center gap-3 text-sm'>
						<Checkbox.Root
							checked={selected.includes(row)}
							onCheckedChange={checked =>
								setSelected(current => (checked ? [...current, row] : current.filter(entry => entry !== row)))
							}
						>
							<Checkbox.Indicator />
						</Checkbox.Root>
						{row}
					</label>
				))}
			</div>
			{selected.length > 0 && (
				<BulkBar.Root className='static'>
					<BulkBar.Count>{selected.length} selected</BulkBar.Count>
					<BulkBar.Actions>
						<Button tone='ghost' onClick={() => setSelected([])}>
							Clear
						</Button>
						<Button tone='coral'>Archive</Button>
					</BulkBar.Actions>
				</BulkBar.Root>
			)}
		</>
	)
}

export { BulkDemo }
