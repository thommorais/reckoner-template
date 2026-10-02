import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Calendar } from './calendar'
import { DateRangePicker } from './date-range-picker'

const Parts = () => (
	<>
		<DateRangePicker.Trigger>
			<DateRangePicker.Value placeholder='Pick a period' />
		</DateRangePicker.Trigger>
		<DateRangePicker.Content>
			<DateRangePicker.Title>Period</DateRangePicker.Title>
			<DateRangePicker.Calendar defaultMonth={new Date(2024, 2, 1)}>
				<Calendar.Days />
			</DateRangePicker.Calendar>
		</DateRangePicker.Content>
	</>
)

const renderPicker = (props: Parameters<typeof DateRangePicker.Root>[0] = {}) =>
	render(
		<DateRangePicker.Root locale='en-US' {...props}>
			<Parts />
		</DateRangePicker.Root>,
	)

const trigger = () => document.querySelector<HTMLButtonElement>('[data-slot=date-range-picker-trigger]')!
const value = () => document.querySelector<HTMLElement>('[data-slot=date-range-picker-value]')!
const day = (label: string) => screen.getByRole('button', { name: label })

const march = { five: 'Tuesday, March 5, 2024', ten: 'Sunday, March 10, 2024', fifteen: 'Friday, March 15, 2024' }

describe('DateRangePicker', () => {
	it('shows the placeholder and keeps the calendar closed', () => {
		renderPicker()

		expect(value().textContent).toBe('Pick a period')
		expect(document.querySelector('[data-slot=calendar-days]')).toBeNull()
	})

	it('needs two clicks, then reports the range, shows it and closes', () => {
		const onValueChange = vi.fn()
		renderPicker({ onValueChange })

		fireEvent.click(trigger())
		fireEvent.click(day(march.five))

		expect(onValueChange).not.toHaveBeenCalled()
		expect(trigger().getAttribute('aria-expanded')).toBe('true')

		fireEvent.click(day(march.fifteen))

		expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2024, 2, 5), to: new Date(2024, 2, 15) })
		expect(value().textContent).toContain('15, 2024')
		expect(trigger().getAttribute('aria-expanded')).toBe('false')
	})

	it('orders the range when the second click is earlier', () => {
		const onValueChange = vi.fn()
		renderPicker({ onValueChange })

		fireEvent.click(trigger())
		fireEvent.click(day(march.fifteen))
		fireEvent.click(day(march.five))

		expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2024, 2, 5), to: new Date(2024, 2, 15) })
	})

	it('marks the edges and the days between while a range is shown', () => {
		renderPicker({ defaultValue: { from: new Date(2024, 2, 5), to: new Date(2024, 2, 15) } })

		fireEvent.click(trigger())

		expect(day(march.five).getAttribute('aria-pressed')).toBe('true')
		expect(day(march.fifteen).getAttribute('aria-pressed')).toBe('true')
		expect(day(march.ten).getAttribute('aria-pressed')).toBe('false')
		expect(day(march.ten).className).toContain('bg-journ-coral/25')
		expect(day('Wednesday, March 20, 2024').className).not.toContain('bg-journ-coral/25')
	})

	it('shows only the first end while the second is pending', () => {
		renderPicker({ defaultValue: { from: new Date(2024, 2, 5), to: new Date(2024, 2, 15) } })

		fireEvent.click(trigger())
		fireEvent.click(day('Monday, March 18, 2024'))

		expect(day('Monday, March 18, 2024').getAttribute('aria-pressed')).toBe('true')
		expect(day(march.five).getAttribute('aria-pressed')).toBe('false')
		expect(day(march.ten).className).not.toContain('bg-journ-coral/25')
	})
})
