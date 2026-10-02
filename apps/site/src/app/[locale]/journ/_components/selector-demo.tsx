'use client'

import { MultipleSelector } from 'journ/multiple-selector'
import { ChevronsUpDown } from 'lucide-react'

const groups = [
	{ name: 'Queens', venues: ['Astoria', 'Long Island City', 'Rego Park'] },
	{ name: 'Elsewhere', venues: ['Brooklyn', 'Manhattan', 'Hoboken'] },
] as const

const SelectorDemo = () => (
	<MultipleSelector.Root defaultValue={['Astoria', 'Brooklyn']} fixed={['Astoria']} max={5}>
		<div className='flex flex-col gap-3'>
			<MultipleSelector.Trigger className='w-full'>
				<MultipleSelector.Value placeholder='Pick venues' />
				<ChevronsUpDown className='ml-auto' />
			</MultipleSelector.Trigger>
			<div className='flex flex-wrap gap-2'>
				<MultipleSelector.Tags />
			</div>
			<p className='text-sm/5 opacity-70'>Astoria is fixed. Up to 5, and you can create your own.</p>
		</div>
		<MultipleSelector.Content>
			<MultipleSelector.Title>Venues</MultipleSelector.Title>
			<MultipleSelector.Frame label='Venues'>
				<MultipleSelector.Input placeholder='Search or create a venue' />
				<MultipleSelector.List>
					<MultipleSelector.Empty>No venue found</MultipleSelector.Empty>
					{groups.map(group => (
						<MultipleSelector.Group key={group.name} heading={group.name}>
							{group.venues.map(venue => (
								<MultipleSelector.Item key={venue} value={venue}>
									{venue}
									<MultipleSelector.ItemIndicator />
								</MultipleSelector.Item>
							))}
						</MultipleSelector.Group>
					))}
					<MultipleSelector.Create />
				</MultipleSelector.List>
			</MultipleSelector.Frame>
		</MultipleSelector.Content>
	</MultipleSelector.Root>
)

export { SelectorDemo }
