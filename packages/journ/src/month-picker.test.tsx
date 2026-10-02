import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MonthPicker } from './month-picker'

const Parts = () => (
	<MonthPicker.Frame>
		<MonthPicker.Header>
			<MonthPicker.Heading />
			<MonthPicker.Previous />
			<MonthPicker.Next />
		</MonthPicker.Header>
		<MonthPicker.Months />
		<MonthPicker.Years />
	</MonthPicker.Frame>
)

const renderPicker = (props: Parameters<typeof MonthPicker.Root>[0] = {}) =>
	render(
		<MonthPicker.Root locale='en-US' defaultMonth={new Date(2024, 5, 1)} {...props}>
			<Parts />
		</MonthPicker.Root>,
	)

const heading = () => document.querySelector<HTMLElement>('[data-slot=calendar-heading]')!

describe('MonthPicker', () => {
	it('starts on the months of the given year and never shows days', () => {
		renderPicker()

		expect(heading().textContent).toBe('2024')
		expect(
			screen.getAllByRole('button', { pressed: false }).filter(button => button.textContent === 'Jan'),
		).toHaveLength(1)
		expect(document.querySelector('[data-slot=calendar-days]')).toBeNull()
	})

	it('selects a month and reports the first of it', () => {
		const onValueChange = vi.fn()
		renderPicker({ onValueChange })

		fireEvent.click(screen.getByRole('button', { name: 'Mar' }))

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 1))
		expect(screen.getByRole('button', { name: 'Mar' }).getAttribute('aria-pressed')).toBe('true')
		expect(heading().textContent).toBe('2024')
	})

	it('marks the default value', () => {
		renderPicker({ defaultValue: new Date(2024, 8, 17) })

		expect(screen.getByRole('button', { name: 'Sep' }).getAttribute('aria-pressed')).toBe('true')
	})

	it('pages by year with the arrows', () => {
		renderPicker()

		fireEvent.click(screen.getByRole('button', { name: 'Next' }))
		expect(heading().textContent).toBe('2025')

		fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
		fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
		expect(heading().textContent).toBe('2023')
	})

	it('picks a year from the years view without choosing a month', () => {
		const onValueChange = vi.fn()
		renderPicker({ onValueChange })

		fireEvent.click(heading())
		fireEvent.click(screen.getByRole('button', { name: '2020' }))

		expect(heading().textContent).toBe('2020')
		expect(screen.getByRole('button', { name: 'Mar' })).toBeTruthy()
		expect(onValueChange).not.toHaveBeenCalled()
	})
})
