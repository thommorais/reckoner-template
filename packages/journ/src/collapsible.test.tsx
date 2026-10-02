import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Collapsible } from './collapsible'

vi.mock('animejs', () => ({ animate: vi.fn() }))

const renderCollapsible = (defaultOpen = false) =>
	render(
		<Collapsible.Root defaultOpen={defaultOpen}>
			<Collapsible.Trigger>Toggle</Collapsible.Trigger>
			<Collapsible.Content>Hidden body</Collapsible.Content>
		</Collapsible.Root>,
	)

describe('Collapsible', () => {
	it('is closed by default', () => {
		renderCollapsible()

		expect(screen.queryByText('Hidden body')).toBeNull()
		expect(screen.getByRole('button', { name: 'Toggle' }).getAttribute('aria-expanded')).toBe('false')
	})

	it('opens and closes on click', () => {
		renderCollapsible()
		const trigger = screen.getByRole('button', { name: 'Toggle' })

		fireEvent.click(trigger)
		expect(screen.getByText('Hidden body')).toBeTruthy()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')

		fireEvent.click(trigger)
		expect(screen.queryByText('Hidden body')).toBeNull()
	})

	it('respects defaultOpen', () => {
		renderCollapsible(true)

		expect(screen.getByText('Hidden body')).toBeTruthy()
	})
})
