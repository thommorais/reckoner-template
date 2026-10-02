import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { formatDuration, minutesBetween } from './lib/time'
import { TimeRange } from './time-range'

describe('time helpers', () => {
	it('measures the minutes between two times, wrapping past midnight', () => {
		expect(minutesBetween('09:00', '11:30')).toBe(150)
		expect(minutesBetween('22:00', '06:00')).toBe(480)
		expect(minutesBetween('08:15', '08:15')).toBe(0)
	})

	it('rejects missing or impossible times', () => {
		expect(minutesBetween('', '10:00')).toBeNull()
		expect(minutesBetween('25:00', '10:00')).toBeNull()
		expect(minutesBetween('10:60', '11:00')).toBeNull()
	})

	it('formats a duration', () => {
		expect(formatDuration(150)).toBe('2h 30m')
		expect(formatDuration(45)).toBe('45m')
		expect(formatDuration(120)).toBe('2h')
		expect(formatDuration(0)).toBe('0m')
	})
})

const renderRange = (props: React.ComponentProps<typeof TimeRange.Root> = {}) =>
	render(
		<TimeRange.Root {...props}>
			<TimeRange.Start aria-label='Start' />
			<TimeRange.Stop aria-label='Stop' />
			<TimeRange.Duration aria-label='Duration' />
		</TimeRange.Root>,
	)

const start = () => screen.getByLabelText('Start') as HTMLInputElement
const stop = () => screen.getByLabelText('Stop') as HTMLInputElement
const duration = () => screen.getByLabelText('Duration')

describe('TimeRange', () => {
	it('is empty until both times are set', () => {
		renderRange()

		expect(start().value).toBe('')
		expect(duration().textContent).toBe('')

		fireEvent.change(start(), { target: { value: '09:00' } })
		expect(duration().textContent).toBe('')
	})

	it('shows the duration and reports each change', () => {
		const onValueChange = vi.fn()
		renderRange({ onValueChange })

		fireEvent.change(start(), { target: { value: '09:00' } })
		fireEvent.change(stop(), { target: { value: '11:30' } })

		expect(duration().textContent).toBe('2h 30m')
		expect(onValueChange).toHaveBeenLastCalledWith({ start: '09:00', stop: '11:30' })
	})

	it('treats a stop before the start as the next day', () => {
		renderRange({ defaultValue: { start: '22:00', stop: '06:00' } })

		expect(duration().textContent).toBe('8h')
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<TimeRange.Root value={{ start: '10:00', stop: '10:45' }}>
				<TimeRange.Duration aria-label='Duration' />
			</TimeRange.Root>,
		)
		expect(duration().textContent).toBe('45m')

		rerender(
			<TimeRange.Root value={{ start: '10:00', stop: '12:00' }}>
				<TimeRange.Duration aria-label='Duration' />
			</TimeRange.Root>,
		)
		expect(duration().textContent).toBe('2h')
	})
})
