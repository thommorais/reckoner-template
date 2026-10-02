import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavigationMenu } from './navigation-menu'

const renderMenu = () =>
	render(
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href='/reports'>Reports panel</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='/pricing' active>
						Pricing
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>,
	)

describe('NavigationMenu', () => {
	it('keeps the panel closed until the trigger is used', () => {
		renderMenu()

		expect(screen.queryByText('Reports panel')).toBeNull()
		expect(screen.getByRole('button', { name: 'Products' }).getAttribute('aria-expanded')).toBe('false')
	})

	it('opens and closes the panel from the trigger', () => {
		renderMenu()
		const trigger = screen.getByRole('button', { name: 'Products' })

		fireEvent.click(trigger)
		expect(screen.getByText('Reports panel')).toBeTruthy()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')

		fireEvent.click(trigger)
		expect(screen.queryByText('Reports panel')).toBeNull()
	})

	it('marks the active link as the current page', () => {
		renderMenu()

		expect(screen.getByRole('link', { name: 'Pricing' }).getAttribute('aria-current')).toBe('page')
	})
})
