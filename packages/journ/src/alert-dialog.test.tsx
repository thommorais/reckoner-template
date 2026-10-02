import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AlertDialog } from './alert-dialog'

const renderDialog = (onConfirm?: () => void) =>
	render(
		<AlertDialog.Root>
			<AlertDialog.Trigger>Delete</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title>Delete report?</AlertDialog.Title>
				<AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
				<AlertDialog.Actions>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action onClick={onConfirm}>Confirm</AlertDialog.Action>
				</AlertDialog.Actions>
			</AlertDialog.Content>
		</AlertDialog.Root>,
	)

describe('AlertDialog', () => {
	it('is closed until the trigger is clicked', () => {
		renderDialog()

		expect(screen.queryByRole('alertdialog')).toBeNull()

		fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

		expect(screen.getByRole('alertdialog')).toBeTruthy()
		expect(screen.getByText('This cannot be undone.')).toBeTruthy()
	})

	it('runs the action and closes', () => {
		const onConfirm = vi.fn()
		renderDialog(onConfirm)

		fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

		expect(onConfirm).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('alertdialog')).toBeNull()
	})

	it('closes on cancel without confirming', () => {
		const onConfirm = vi.fn()
		renderDialog(onConfirm)

		fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

		expect(onConfirm).not.toHaveBeenCalled()
		expect(screen.queryByRole('alertdialog')).toBeNull()
	})
})
