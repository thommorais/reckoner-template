import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MonthStepper } from './month-stepper'

const renderStepper = (props: React.ComponentProps<typeof MonthStepper.Root> = {}) =>
	render(
		<MonthStepper.Root defaultValue={new Date(2026, 9, 15)} {...props}>
			<MonthStepper.Previous />
			<MonthStepper.Label />
			<MonthStepper.Next />
		</MonthStepper.Root>,
	)

describe('MonthStepper', () => {
	it('shows the month in the given locale', () => {
		renderStepper()
		expect(screen.getByText('October 2026')).toBeTruthy()
	})

	it('localizes the label', () => {
		renderStepper({ locale: 'pt-BR' })
		expect(screen.getByText('outubro de 2026')).toBeTruthy()
	})

	it('steps forward and back and reports the first of the month', () => {
		const onValueChange = vi.fn()
		renderStepper({ onValueChange })

		fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
		expect(screen.getByText('November 2026')).toBeTruthy()
		expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 1))

		fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
		fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
		expect(screen.getByText('September 2026')).toBeTruthy()
	})

	it('rolls over the year', () => {
		renderStepper({ defaultValue: new Date(2026, 11, 3) })

		fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

		expect(screen.getByText('January 2027')).toBeTruthy()
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<MonthStepper.Root value={new Date(2026, 0, 20)}>
				<MonthStepper.Label />
			</MonthStepper.Root>,
		)
		expect(screen.getByText('January 2026')).toBeTruthy()

		rerender(
			<MonthStepper.Root value={new Date(2026, 5, 2)}>
				<MonthStepper.Label />
			</MonthStepper.Root>,
		)
		expect(screen.getByText('June 2026')).toBeTruthy()
	})
})
