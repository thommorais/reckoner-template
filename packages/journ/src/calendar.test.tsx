import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Calendar, type CalendarContextValue } from './calendar'

const Layout = () => (
	<Calendar.Frame>
		<Calendar.Header>
			<Calendar.Heading />
			<Calendar.Previous />
			<Calendar.Next />
		</Calendar.Header>
		<Calendar.Weekdays />
		<Calendar.Days />
		<Calendar.Months />
		<Calendar.Years />
	</Calendar.Frame>
)

const renderCalendar = (props: Parameters<typeof Calendar.Root>[0] = {}) =>
	render(
		<Calendar.Root locale='en-US' weekStartsOn={1} defaultMonth={new Date(2024, 2, 1)} {...props}>
			<Layout />
		</Calendar.Root>,
	)

const heading = () => document.querySelector<HTMLButtonElement>('[data-slot=calendar-heading]')!
const day = (name: string) => screen.getByRole('button', { name })
const dayButtons = () => document.querySelectorAll('[data-slot=calendar-days] button')

describe('Calendar', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('shows six weeks of the default month starting on the given weekday', () => {
		renderCalendar()

		expect(heading().textContent).toBe('March 2024')
		expect(document.querySelector('[data-slot=calendar-weekdays]')?.firstElementChild?.textContent).toBe('Mon')
		expect(dayButtons()).toHaveLength(42)
		expect(dayButtons()[0]?.getAttribute('aria-label')).toBe('Monday, February 26, 2024')
		expect(day('Monday, February 26, 2024').dataset.outside).toBe('true')
		expect(day('Friday, March 1, 2024').dataset.outside).toBe('false')
	})

	it('selects a day and reports it', () => {
		const onValueChange = vi.fn()
		renderCalendar({ onValueChange })

		fireEvent.click(day('Friday, March 15, 2024'))

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 15))
		expect(day('Friday, March 15, 2024').getAttribute('aria-pressed')).toBe('true')
	})

	it('moves to the month of a selected day from another month', () => {
		renderCalendar()

		fireEvent.click(day('Monday, February 26, 2024'))

		expect(heading().textContent).toBe('February 2024')
		expect(day('Monday, February 26, 2024').getAttribute('aria-pressed')).toBe('true')
	})

	it('keeps the controlled value until the parent changes it', () => {
		const onValueChange = vi.fn()
		renderCalendar({ value: new Date(2024, 2, 4), onValueChange })

		fireEvent.click(day('Friday, March 15, 2024'))

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 15))
		expect(day('Friday, March 15, 2024').getAttribute('aria-pressed')).toBe('false')
		expect(day('Monday, March 4, 2024').getAttribute('aria-pressed')).toBe('true')
	})

	it('pages by month, by year and by twelve years depending on the view', () => {
		renderCalendar()

		fireEvent.click(screen.getByRole('button', { name: 'Next' }))
		expect(heading().textContent).toBe('April 2024')
		fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
		fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
		expect(heading().textContent).toBe('February 2024')

		fireEvent.click(heading())
		fireEvent.click(screen.getByRole('button', { name: 'Next' }))
		expect(heading().textContent).toBe('2025')

		fireEvent.click(heading())
		expect(heading().textContent).toBe('2016 – 2027')
		fireEvent.click(screen.getByRole('button', { name: 'Next' }))
		expect(heading().textContent).toBe('2028 – 2039')
	})

	it('zooms out from the heading and back in by picking a year and a month', () => {
		renderCalendar()

		fireEvent.click(heading())
		expect(document.querySelector('[data-slot=calendar-days]')).toBeNull()
		expect(document.querySelectorAll('[data-slot=calendar-months] button')).toHaveLength(12)

		fireEvent.click(heading())
		expect(heading().disabled).toBe(true)
		expect(document.querySelectorAll('[data-slot=calendar-years] button')).toHaveLength(12)

		fireEvent.click(screen.getByRole('button', { name: '2021' }))
		expect(heading().textContent).toBe('2021')

		fireEvent.click(screen.getByRole('button', { name: 'Jul' }))
		expect(heading().textContent).toBe('July 2021')
		expect(document.querySelector('[data-slot=calendar-weekdays]')).not.toBeNull()
	})

	it('marks today', () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2024, 2, 20, 12))
		renderCalendar()

		expect(day('Wednesday, March 20, 2024').getAttribute('aria-current')).toBe('date')
		expect(day('Thursday, March 21, 2024').hasAttribute('aria-current')).toBe(false)
	})

	it('renders injected state and calls injected actions', () => {
		const context: CalendarContextValue = {
			state: { selected: new Date(2030, 0, 10), month: new Date(2030, 0, 1), view: 'days' },
			actions: { select: vi.fn(), showMonth: vi.fn(), showView: vi.fn(), previous: vi.fn(), next: vi.fn() },
			meta: { locale: 'en-US', weekStartsOn: 0 },
		}
		render(
			<Calendar.Provider {...context}>
				<Layout />
			</Calendar.Provider>,
		)

		expect(heading().textContent).toBe('January 2030')
		expect(day('Thursday, January 10, 2030').getAttribute('aria-pressed')).toBe('true')

		fireEvent.click(day('Friday, January 11, 2030'))
		fireEvent.click(screen.getByRole('button', { name: 'Next' }))
		fireEvent.click(heading())

		expect(context.actions.select).toHaveBeenCalledWith(new Date(2030, 0, 11))
		expect(context.actions.next).toHaveBeenCalled()
		expect(context.actions.showView).toHaveBeenCalledWith('months')
	})

	it('rejects parts rendered outside a provider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<Calendar.Days />)).toThrow('Calendar.Provider')

		spy.mockRestore()
	})
})
