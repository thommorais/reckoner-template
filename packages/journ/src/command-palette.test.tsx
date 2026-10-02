import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CommandPalette } from './command-palette'

const commands = ['Open reports', 'New schedule', 'Sign out']

const renderPalette = (props: Parameters<typeof CommandPalette.Root>[0] = {}) =>
	render(
		<CommandPalette.Root {...props}>
			<CommandPalette.Trigger>Search</CommandPalette.Trigger>
			<CommandPalette.Content>
				<CommandPalette.Frame label='Commands'>
					<CommandPalette.Input placeholder='Type a command' />
					<CommandPalette.List>
						<CommandPalette.Empty>No command found</CommandPalette.Empty>
						{commands.map(command => (
							<CommandPalette.Item key={command} value={command}>
								{command}
							</CommandPalette.Item>
						))}
					</CommandPalette.List>
				</CommandPalette.Frame>
			</CommandPalette.Content>
		</CommandPalette.Root>,
	)

const pressShortcut = (init: KeyboardEventInit) => fireEvent.keyDown(document, { key: 'k', ...init })

describe('CommandPalette', () => {
	it('is closed until opened', () => {
		renderPalette()

		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('opens from the trigger', () => {
		renderPalette()

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeTruthy()
		expect(screen.getAllByRole('option')).toHaveLength(3)
	})

	it('toggles with Cmd+K and Ctrl+K', () => {
		renderPalette()

		pressShortcut({ metaKey: true })
		expect(screen.getByRole('dialog')).toBeTruthy()

		pressShortcut({ ctrlKey: true })
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('ignores the key without a modifier and when the shortcut is disabled', () => {
		const { unmount } = renderPalette()
		pressShortcut({})
		expect(screen.queryByRole('dialog')).toBeNull()
		unmount()

		renderPalette({ shortcut: '' })
		pressShortcut({ metaKey: true })
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('runs onSelect with the item value and closes', () => {
		const onSelect = vi.fn()
		renderPalette({ onSelect })

		pressShortcut({ metaKey: true })
		fireEvent.click(screen.getByRole('option', { name: 'New schedule' }))

		expect(onSelect).toHaveBeenCalledWith('New schedule')
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('filters while typing and shows the empty state', () => {
		renderPalette()

		pressShortcut({ metaKey: true })
		fireEvent.change(screen.getByPlaceholderText('Type a command'), { target: { value: 'sign' } })
		expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['Sign out'])

		fireEvent.change(screen.getByPlaceholderText('Type a command'), { target: { value: 'zzz' } })
		expect(screen.getByText('No command found')).toBeTruthy()
	})

	it('closes on Escape', () => {
		renderPalette()

		pressShortcut({ metaKey: true })
		fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('follows a controlled open prop and reports changes', () => {
		const onOpenChange = vi.fn()
		renderPalette({ open: false, onOpenChange })

		pressShortcut({ metaKey: true })

		expect(onOpenChange).toHaveBeenCalledWith(true)
		expect(screen.queryByRole('dialog')).toBeNull()
	})
})
