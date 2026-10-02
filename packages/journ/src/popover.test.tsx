import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Popover } from './popover'

const renderPopover = () =>
	render(
		<Popover.Root>
			<Popover.Trigger>Details</Popover.Trigger>
			<Popover.Content>
				<p>Popover body</p>
				<Popover.Close>Done</Popover.Close>
			</Popover.Content>
		</Popover.Root>,
	)

describe('Popover', () => {
	it('is closed by default', () => {
		renderPopover()

		expect(screen.queryByText('Popover body')).toBeNull()
		expect(screen.getByRole('button', { name: 'Details' }).getAttribute('aria-expanded')).toBe('false')
	})

	it('opens on click', () => {
		renderPopover()

		fireEvent.click(screen.getByRole('button', { name: 'Details' }))

		expect(screen.getByText('Popover body')).toBeTruthy()
		expect(screen.getByRole('button', { name: 'Details' }).getAttribute('aria-expanded')).toBe('true')
	})

	it('closes from Close and on Escape', () => {
		renderPopover()
		const trigger = screen.getByRole('button', { name: 'Details' })

		fireEvent.click(trigger)
		fireEvent.click(screen.getByRole('button', { name: 'Done' }))
		expect(screen.queryByText('Popover body')).toBeNull()

		fireEvent.click(trigger)
		fireEvent.keyDown(screen.getByText('Popover body'), { key: 'Escape' })
		expect(screen.queryByText('Popover body')).toBeNull()
	})
})
