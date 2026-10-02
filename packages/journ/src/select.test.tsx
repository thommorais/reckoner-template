import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './select'

const renderSelect = (onValueChange?: (value: string) => void) =>
	render(
		<Select.Root onValueChange={onValueChange}>
			<Select.Trigger aria-label='Period'>
				<Select.Value placeholder='Pick a period' />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value='week'>This week</Select.Item>
				<Select.Item value='month'>This month</Select.Item>
				<Select.Item value='year' disabled>
					This year
				</Select.Item>
			</Select.Content>
		</Select.Root>,
	)

const open = () => fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })

describe('Select', () => {
	it('shows the placeholder and keeps options closed', () => {
		renderSelect()

		expect(screen.getByText('Pick a period')).toBeTruthy()
		expect(screen.queryByRole('option')).toBeNull()
	})

	it('opens with the keyboard and lists the options', () => {
		renderSelect()

		open()

		expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual([
			'This week',
			'This month',
			'This year',
		])
	})

	it('selects an option, reports it and shows it in the trigger', () => {
		const onValueChange = vi.fn()
		renderSelect(onValueChange)

		open()
		fireEvent.click(screen.getByRole('option', { name: 'This month' }))

		expect(onValueChange).toHaveBeenCalledWith('month')
		expect(screen.getByRole('combobox').textContent).toContain('This month')
	})

	it('does not select a disabled option', () => {
		const onValueChange = vi.fn()
		renderSelect(onValueChange)

		open()
		fireEvent.click(screen.getByRole('option', { name: 'This year' }))

		expect(onValueChange).not.toHaveBeenCalled()
	})
})
