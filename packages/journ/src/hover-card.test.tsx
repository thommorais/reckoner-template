import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HoverCard } from './hover-card'

const renderCard = () =>
	render(
		<HoverCard.Root openDelay={0} closeDelay={0}>
			<HoverCard.Trigger href='#'>Hanna</HoverCard.Trigger>
			<HoverCard.Content>Revenue lead</HoverCard.Content>
		</HoverCard.Root>,
	)

describe('HoverCard', () => {
	it('is hidden by default', () => {
		renderCard()

		expect(screen.queryByText('Revenue lead')).toBeNull()
	})

	it('opens on focus and closes on blur', async () => {
		renderCard()
		const trigger = screen.getByRole('link', { name: 'Hanna' })

		fireEvent.focus(trigger)
		expect(await screen.findByText('Revenue lead')).toBeTruthy()

		fireEvent.blur(trigger)
		await waitFor(() => expect(screen.queryByText('Revenue lead')).toBeNull())
	})
})
