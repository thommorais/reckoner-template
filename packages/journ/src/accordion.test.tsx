import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Accordion } from './accordion'

vi.mock('animejs', () => ({ animate: vi.fn() }))

const renderAccordion = (type: 'single' | 'multiple' = 'single') => {
	const props =
		type === 'single'
			? { type: 'single' as const, collapsible: true as const, defaultValue: 'a' }
			: { type: 'multiple' as const, defaultValue: ['a'] }

	return render(
		<Accordion.Root {...props}>
			<Accordion.Item value='a'>
				<Accordion.Trigger>First</Accordion.Trigger>
				<Accordion.Content>Body A</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='b'>
				<Accordion.Trigger>Second</Accordion.Trigger>
				<Accordion.Content>Body B</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>,
	)
}

describe('Accordion', () => {
	it('opens the default item only', () => {
		renderAccordion()

		expect(screen.getByText('Body A')).toBeTruthy()
		expect(screen.queryByText('Body B')).toBeNull()
		expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-expanded')).toBe('true')
	})

	it('closes the open item when another opens in single mode', () => {
		renderAccordion()

		fireEvent.click(screen.getByRole('button', { name: 'Second' }))

		expect(screen.getByText('Body B')).toBeTruthy()
		expect(screen.queryByText('Body A')).toBeNull()
	})

	it('collapses the open item when collapsible', () => {
		renderAccordion()

		fireEvent.click(screen.getByRole('button', { name: 'First' }))

		expect(screen.queryByText('Body A')).toBeNull()
	})

	it('keeps several items open in multiple mode', () => {
		renderAccordion('multiple')

		fireEvent.click(screen.getByRole('button', { name: 'Second' }))

		expect(screen.getByText('Body A')).toBeTruthy()
		expect(screen.getByText('Body B')).toBeTruthy()
	})
})
