import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Stepper } from './stepper'

const renderStepper = (value: number) =>
	render(
		<Stepper.Root value={value} aria-label='Progress'>
			{[1, 2, 3].map(step => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<Stepper.Label>Step {step}</Stepper.Label>
				</Stepper.Item>
			))}
		</Stepper.Root>,
	)

const statuses = () => screen.getAllByRole('listitem').map(item => item.getAttribute('data-status'))

describe('Stepper', () => {
	it('derives each status from the current step', () => {
		renderStepper(2)

		expect(statuses()).toEqual(['complete', 'current', 'upcoming'])
	})

	it('marks only the current step with aria-current', () => {
		renderStepper(2)

		const items = screen.getAllByRole('listitem')
		expect(items.map(item => item.getAttribute('aria-current'))).toEqual([null, 'step', null])
	})

	it('shows a check for completed steps and the number otherwise', () => {
		renderStepper(3)

		const indicators = document.querySelectorAll('[data-slot=stepper-indicator]')
		expect(indicators[0]?.querySelector('svg')).toBeTruthy()
		expect(indicators[1]?.querySelector('svg')).toBeTruthy()
		expect(indicators[2]?.textContent).toBe('3')
	})

	it('treats every step as upcoming before the first', () => {
		renderStepper(0)

		expect(statuses()).toEqual(['upcoming', 'upcoming', 'upcoming'])
	})

	it('rejects parts outside their parents', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<Stepper.Item step={1} />)).toThrow('Stepper.Root')
		expect(() => render(<Stepper.Indicator />)).toThrow('Stepper.Item')

		spy.mockRestore()
	})
})
