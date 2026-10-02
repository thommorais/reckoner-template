import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MultipleSelector } from './multiple-selector'

const venues = ['Astoria', 'Long Island City', 'Rego Park', 'Brooklyn']

const renderSelector = (props: React.ComponentProps<typeof MultipleSelector.Root> = {}, creatable = false) =>
	render(
		<MultipleSelector.Root {...props}>
			<MultipleSelector.Trigger>
				<MultipleSelector.Value placeholder='Pick venues' />
			</MultipleSelector.Trigger>
			<MultipleSelector.Tags />
			<MultipleSelector.Content>
				<MultipleSelector.Title>Venues</MultipleSelector.Title>
				<MultipleSelector.Frame label='Venues'>
					<MultipleSelector.Input placeholder='Search' />
					<MultipleSelector.List>
						<MultipleSelector.Empty>No venue found</MultipleSelector.Empty>
						{venues.map(venue => (
							<MultipleSelector.Item key={venue} value={venue}>
								{venue}
								<MultipleSelector.ItemIndicator />
							</MultipleSelector.Item>
						))}
						{creatable && <MultipleSelector.Create />}
					</MultipleSelector.List>
				</MultipleSelector.Frame>
			</MultipleSelector.Content>
		</MultipleSelector.Root>,
	)

const trigger = () => document.querySelector<HTMLButtonElement>('[data-slot=multiple-selector-trigger]')!
const value = () => document.querySelector<HTMLElement>('[data-slot=multiple-selector-value]')!
const option = (name: string) => screen.getByRole('option', { name: new RegExp(`^${name}`) })
const chips = () => [...document.querySelectorAll('[data-slot=chip-tag]')].map(chip => chip.textContent)
const open = () => fireEvent.click(trigger())
const search = (text: string) => fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: text } })

describe('MultipleSelector', () => {
	it('shows the placeholder until something is chosen', () => {
		renderSelector()

		expect(value().textContent).toBe('Pick venues')
		expect(value().dataset.placeholder).toBe('true')
		expect(chips()).toEqual([])
	})

	it('shows how many are chosen', () => {
		renderSelector({ defaultValue: ['Astoria', 'Brooklyn'] })

		expect(value().textContent).toBe('2 selected')
		expect(chips()).toEqual(['Astoria', 'Brooklyn'])
	})

	it('toggles values, reports each change and stays open', () => {
		const onValueChange = vi.fn()
		renderSelector({ onValueChange })
		open()

		fireEvent.click(option('Astoria'))
		fireEvent.click(option('Brooklyn'))
		expect(onValueChange).toHaveBeenLastCalledWith(['Astoria', 'Brooklyn'])
		expect(trigger().getAttribute('aria-expanded')).toBe('true')
		expect(option('Astoria').getAttribute('data-checked')).toBe('true')

		fireEvent.click(option('Astoria'))
		expect(onValueChange).toHaveBeenLastCalledWith(['Brooklyn'])
		expect(chips()).toEqual(['Brooklyn'])
	})

	it('removes a value from its chip', () => {
		renderSelector({ defaultValue: ['Astoria', 'Brooklyn'] })

		fireEvent.click(screen.getByRole('button', { name: 'Remove Astoria' }))

		expect(chips()).toEqual(['Brooklyn'])
	})

	describe('fixed values', () => {
		it('are always selected, cannot be toggled and have no remove button', () => {
			renderSelector({ fixed: ['Astoria'], defaultValue: ['Brooklyn'] })

			expect(chips()).toEqual(['Astoria', 'Brooklyn'])
			expect(screen.queryByRole('button', { name: 'Remove Astoria' })).toBeNull()
			expect(screen.getByRole('button', { name: 'Remove Brooklyn' })).toBeTruthy()

			open()
			expect(option('Astoria').getAttribute('aria-disabled')).toBe('true')
		})
	})

	describe('max', () => {
		it('locks unchosen values once full but still lets chosen ones go', () => {
			const onValueChange = vi.fn()
			renderSelector({ max: 2, defaultValue: ['Astoria', 'Brooklyn'], onValueChange })
			open()

			expect(option('Rego Park').getAttribute('aria-disabled')).toBe('true')
			fireEvent.click(option('Rego Park'))
			expect(onValueChange).not.toHaveBeenCalled()

			fireEvent.click(option('Astoria'))
			expect(onValueChange).toHaveBeenCalledWith(['Brooklyn'])
			expect(option('Rego Park').getAttribute('aria-disabled')).not.toBe('true')
		})
	})

	describe('creating values', () => {
		it('offers typed text as a new value, adds it and clears the search', () => {
			const onValueChange = vi.fn()
			renderSelector({ onValueChange }, true)
			open()

			search('Queens')
			fireEvent.click(screen.getByRole('option', { name: /Create/ }))

			expect(onValueChange).toHaveBeenCalledWith(['Queens'])
			expect(chips()).toEqual(['Queens'])
			expect((screen.getByPlaceholderText('Search') as HTMLInputElement).value).toBe('')
		})

		it('is hidden when the text is empty or already chosen', () => {
			renderSelector({ defaultValue: ['Queens'] }, true)
			open()

			expect(screen.queryByRole('option', { name: /Create/ })).toBeNull()

			search('queens')
			expect(screen.queryByRole('option', { name: /Create/ })).toBeNull()

			search('Bronx')
			expect(screen.getByRole('option', { name: /Create .Bronx./ })).toBeTruthy()
		})

		it('is hidden when the selection is full', () => {
			renderSelector({ max: 1, defaultValue: ['Astoria'] }, true)
			open()

			search('Queens')

			expect(screen.queryByRole('option', { name: /Create/ })).toBeNull()
		})
	})

	it('clears the search when the drawer closes', () => {
		renderSelector()
		open()
		search('Rego')

		fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
		open()

		expect((screen.getByPlaceholderText('Search') as HTMLInputElement).value).toBe('')
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<MultipleSelector.Root value={['Astoria']}>
				<MultipleSelector.Tags />
			</MultipleSelector.Root>,
		)
		expect(chips()).toEqual(['Astoria'])

		rerender(
			<MultipleSelector.Root value={['Rego Park', 'Brooklyn']}>
				<MultipleSelector.Tags />
			</MultipleSelector.Root>,
		)
		expect(chips()).toEqual(['Rego Park', 'Brooklyn'])
	})
})
