import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tooltip } from './tooltip'

const renderTooltip = () =>
	render(
		<Tooltip.Root>
			<Tooltip.Trigger>Hover me</Tooltip.Trigger>
			<Tooltip.Content>Helpful hint</Tooltip.Content>
		</Tooltip.Root>,
	)

describe('Tooltip', () => {
	it('is hidden by default', () => {
		renderTooltip()

		expect(screen.queryByRole('tooltip')).toBeNull()
	})

	it('shows on keyboard focus and describes the trigger', () => {
		renderTooltip()

		fireEvent.focus(screen.getByRole('button', { name: 'Hover me' }))

		expect(screen.getByRole('tooltip').textContent).toBe('Helpful hint')
		expect(screen.getByRole('button', { name: 'Hover me' }).getAttribute('aria-describedby')).toBeTruthy()
	})

	it('hides again on blur', () => {
		renderTooltip()
		const trigger = screen.getByRole('button', { name: 'Hover me' })

		fireEvent.focus(trigger)
		fireEvent.blur(trigger)

		expect(screen.queryByRole('tooltip')).toBeNull()
	})
})
