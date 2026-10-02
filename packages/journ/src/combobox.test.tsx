import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Combobox, type ComboboxContextValue } from './combobox'

const reports = [
	{ id: 'r1', name: 'Prime cost' },
	{ id: 'r2', name: 'Menu mix' },
	{ id: 'r3', name: 'Café sales' },
]

const Parts = ({ label }: { label?: string }) => (
	<>
		<Combobox.Trigger>
			<Combobox.Value placeholder='Pick a report'>{label}</Combobox.Value>
		</Combobox.Trigger>
		<Combobox.Content>
			<Combobox.Title>Report</Combobox.Title>
			<Combobox.Frame label='Reports'>
				<Combobox.Input placeholder='Search' />
				<Combobox.List>
					<Combobox.Empty>No report found</Combobox.Empty>
					{reports.map(report => (
						<Combobox.Item key={report.id} value={report.id} keywords={[report.name]}>
							{report.name}
							<Combobox.ItemIndicator />
						</Combobox.Item>
					))}
				</Combobox.List>
			</Combobox.Frame>
		</Combobox.Content>
	</>
)

const renderCombobox = (props: Parameters<typeof Combobox.Root>[0] = {}) =>
	render(
		<Combobox.Root {...props}>
			<Parts label={reports.find(report => report.id === props.defaultValue)?.name} />
		</Combobox.Root>,
	)

const trigger = () => document.querySelector<HTMLButtonElement>('[data-slot=combobox-trigger]')!
const value = () => document.querySelector<HTMLElement>('[data-slot=combobox-value]')!
const options = () => screen.queryAllByRole('option').map(option => option.textContent)
const search = (text: string) => fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: text } })

describe('Combobox', () => {
	it('shows the placeholder and keeps the list closed', () => {
		renderCombobox()

		expect(value().textContent).toBe('Pick a report')
		expect(value().dataset.placeholder).toBe('true')
		expect(screen.queryByRole('option')).toBeNull()
	})

	it('opens and lists every item', () => {
		renderCombobox()

		fireEvent.click(trigger())

		expect(options()).toEqual(['Prime cost', 'Menu mix', 'Café sales'])
	})

	it('filters on keywords, ignoring case and accents', () => {
		renderCombobox()
		fireEvent.click(trigger())

		search('CAFE')

		expect(options()).toEqual(['Café sales'])
	})

	it('does not match the item value when keywords are given', () => {
		renderCombobox()
		fireEvent.click(trigger())

		search('r2')

		expect(options()).toEqual([])
		expect(screen.getByText('No report found')).toBeTruthy()
	})

	it('selects an item, reports its value and closes', () => {
		const onValueChange = vi.fn()
		renderCombobox({ onValueChange })

		fireEvent.click(trigger())
		fireEvent.click(screen.getByRole('option', { name: 'Menu mix' }))

		expect(onValueChange).toHaveBeenCalledWith('r2')
		expect(value().dataset.placeholder).toBe('false')
		expect(trigger().getAttribute('aria-expanded')).toBe('false')
	})

	it('shows the selected label and marks only the selected item', () => {
		renderCombobox({ defaultValue: 'r1' })

		expect(value().textContent).toBe('Prime cost')

		fireEvent.click(trigger())

		const checked = document.querySelectorAll('[data-slot=combobox-item][data-checked=true]')
		expect([...checked].map(item => item.textContent)).toEqual(['Prime cost'])
		expect(document.querySelectorAll('[data-slot=combobox-item-indicator]')).toHaveLength(1)
	})

	it('renders injected state and calls injected actions', () => {
		const context: ComboboxContextValue = {
			state: { value: 'r3', open: true },
			actions: { select: vi.fn(), setOpen: vi.fn() },
		}
		render(
			<Combobox.Provider {...context}>
				<Parts label='Café sales' />
			</Combobox.Provider>,
		)

		expect(value().textContent).toBe('Café sales')

		fireEvent.click(screen.getByRole('option', { name: 'Prime cost' }))

		expect(context.actions.select).toHaveBeenCalledWith('r1')
	})

	it('rejects parts rendered outside their parents', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<Combobox.Value />)).toThrow('Combobox.Provider')
		expect(() =>
			render(
				<Combobox.Root>
					<Combobox.ItemIndicator />
				</Combobox.Root>,
			),
		).toThrow('Combobox.Item')

		spy.mockRestore()
	})
})
