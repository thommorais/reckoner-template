import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ContextMenu } from './context-menu'

const renderMenu = (onSelect?: () => void) =>
	render(
		<ContextMenu.Root>
			<ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Label>Report</ContextMenu.Label>
				<ContextMenu.Item onSelect={onSelect}>Rename</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item disabled>Delete</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>,
	)

const open = () => fireEvent.contextMenu(screen.getByText('Right click me'))

describe('ContextMenu', () => {
	it('is closed until right clicked', () => {
		renderMenu()

		expect(screen.queryByRole('menu')).toBeNull()

		open()

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
