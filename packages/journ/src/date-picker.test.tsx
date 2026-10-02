import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Calendar } from './calendar'
import { DatePicker, type DatePickerContextValue } from './date-picker'

const Parts = () => (
	<>
		<DatePicker.Trigger>
			<DatePicker.Value placeholder='First run' />
		</DatePicker.Trigger>
		<DatePicker.Content>
			<DatePicker.Title>First run</DatePicker.Title>
			<DatePicker.Calendar defaultMonth={new Date(2024, 2, 1)}>
				<Calendar.Days />
			</DatePicker.Calendar>
		</DatePicker.Content>
	</>
)

const renderDatePicker = (props: Parameters<typeof DatePicker.Root>[0] = {}) =>
	render(
		<DatePicker.Root locale='en-US' {...props}>
			<Parts />
		</DatePicker.Root>,
	)

const trigger = () => document.querySelector<HTMLButtonElement>('[data-slot=date-picker-trigger]')!
const value = () => document.querySelector<HTMLElement>('[data-slot=date-picker-value]')!

describe('DatePicker', () => {
	it('shows the placeholder and keeps the calendar closed', () => {
		renderDatePicker()

		expect(value().textContent).toBe('First run')
		expect(value().dataset.placeholder).toBe('true')
		expect(document.querySelector('[data-slot=calendar-days]')).toBeNull()
	})

	it('opens the calendar from the trigger', () => {
		renderDatePicker()

		fireEvent.click(trigger())

		expect(screen.getByRole('dialog')).toBeTruthy()
		expect(document.querySelector('[data-slot=calendar-days]')).not.toBeNull()
	})

	it('selects a day, reports it, shows it and closes', () => {
		const onValueChange = vi.fn()
		renderDatePicker({ onValueChange })

		fireEvent.click(trigger())
		fireEvent.click(screen.getByRole('button', { name: 'Friday, March 15, 2024' }))

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 15))
		expect(value().textContent).toBe('Mar 15, 2024')
		expect(value().dataset.placeholder).toBe('false')
		expect(trigger().getAttribute('aria-expanded')).toBe('false')
	})

	it('formats the value with the given options', () => {
		render(
			<DatePicker.Root locale='en-US' defaultValue={new Date(2024, 2, 15)}>
				<DatePicker.Trigger>
					<DatePicker.Value format={{ day: 'numeric', month: 'long' }} />
				</DatePicker.Trigger>
			</DatePicker.Root>,
		)

		expect(value().textContent).toBe('March 15')
	})

	it('renders injected state and calls injected actions', () => {
		const context: DatePickerContextValue = {
			state: { value: new Date(2024, 2, 4), open: true },
			actions: { select: vi.fn(), setOpen: vi.fn() },
			meta: { locale: 'en-US' },
		}
		render(
			<DatePicker.Provider {...context}>
				<Parts />
			</DatePicker.Provider>,
		)

		expect(value().textContent).toBe('Mar 4, 2024')
		expect(screen.getByRole('button', { name: 'Monday, March 4, 2024' }).getAttribute('aria-pressed')).toBe('true')

		fireEvent.click(screen.getByRole('button', { name: 'Friday, March 15, 2024' }))

		expect(context.actions.select).toHaveBeenCalledWith(new Date(2024, 2, 15))
	})

	it('rejects parts rendered outside a provider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<DatePicker.Value />)).toThrow('DatePicker.Provider')

		spy.mockRestore()
	})
})
