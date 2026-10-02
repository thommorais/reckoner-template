import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DropdownMenu } from './dropdown-menu'

const renderMenu = (onSelect?: () => void) =>
	render(
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Label>Report</DropdownMenu.Label>
				<DropdownMenu.Item onSelect={onSelect}>Rename</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>,
	)

const open = () => fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'Enter' })

describe('DropdownMenu', () => {
	it('is closed until opened', () => {
		renderMenu()

		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'Actions' }).getAttribute('aria-expanded')).toBe('false')
	})

	it('opens with the keyboard and lists the items', () => {
		renderMenu()

		open()

		expect(screen.getByRole('menu')).toBeTruthy()
		expect(screen.getAllByRole('menuitem').map(item => item.textContent)).toEqual(['Rename', 'Delete'])
	})

	it('runs onSelect and closes when an item is chosen', () => {
		const onSelect = vi.fn()
		renderMenu(onSelect)

		open()
		fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }))

		expect(onSelect).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('does not select a disabled item', () => {
		const onSelect = vi.fn()
		renderMenu(onSelect)

		open()
		fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

		expect(onSelect).not.toHaveBeenCalled()
	})
})
