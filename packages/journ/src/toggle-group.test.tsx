import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ToggleGroup } from './toggle-group'

describe('ToggleGroup', () => {
	it('selects one item at a time in single mode', () => {
		const onValueChange = vi.fn()
		render(
			<ToggleGroup.Root type='single' defaultValue='list' onValueChange={onValueChange} aria-label='View'>
				<ToggleGroup.Item value='list'>List</ToggleGroup.Item>
				<ToggleGroup.Item value='calendar'>Calendar</ToggleGroup.Item>
			</ToggleGroup.Root>,
		)

		expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('true')

		fireEvent.click(screen.getByRole('radio', { name: 'Calendar' }))

		expect(screen.getByRole('radio', { name: 'Calendar' }).getAttribute('aria-checked')).toBe('true')
		expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('false')
		expect(onValueChange).toHaveBeenCalledWith('calendar')
	})

	it('allows several items in multiple mode', () => {
		render(
			<ToggleGroup.Root type='multiple' aria-label='Tags'>
				<ToggleGroup.Item value='a'>A</ToggleGroup.Item>
				<ToggleGroup.Item value='b'>B</ToggleGroup.Item>
			</ToggleGroup.Root>,
		)

		fireEvent.click(screen.getByRole('button', { name: 'A' }))
		fireEvent.click(screen.getByRole('button', { name: 'B' }))

		expect(screen.getByRole('button', { name: 'A' }).getAttribute('aria-pressed')).toBe('true')
		expect(screen.getByRole('button', { name: 'B' }).getAttribute('aria-pressed')).toBe('true')
	})

	it('ignores disabled items', () => {
		const onValueChange = vi.fn()
		render(
			<ToggleGroup.Root type='single' onValueChange={onValueChange} aria-label='View'>
				<ToggleGroup.Item value='a' disabled>
					A
				</ToggleGroup.Item>
			</ToggleGroup.Root>,
		)

		fireEvent.click(screen.getByRole('radio', { name: 'A' }))

		expect(onValueChange).not.toHaveBeenCalled()
	})
})
