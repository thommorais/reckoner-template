import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OtpInput } from './otp-input'

const renderOtp = (props: React.ComponentProps<typeof OtpInput.Root> = {}) =>
	render(
		<OtpInput.Root {...props}>
			{[0, 1, 2, 3].map(index => (
				<OtpInput.Slot key={index} aria-label={`Digit ${index + 1}`} />
			))}
			<OtpInput.Hidden />
		</OtpInput.Root>,
	)

describe('OtpInput', () => {
	it('renders one box per slot', () => {
		renderOtp()

		expect(screen.getAllByRole('textbox')).toHaveLength(4)
	})

	it('shows a default value across the slots', () => {
		renderOtp({ defaultValue: '12' })

		const values = screen.getAllByRole('textbox').map(input => (input as HTMLInputElement).value)
		expect(values).toEqual(['1', '2', '', ''])
	})

	it('reports the code as it is typed', () => {
		const onValueChange = vi.fn()
		renderOtp({ onValueChange })
		const first = screen.getByLabelText('Digit 1')

		fireEvent.change(first, { target: { value: '7' } })

		expect(onValueChange).toHaveBeenCalledWith('7')
	})

	it('rejects characters that fail numeric validation', () => {
		const onValueChange = vi.fn()
		renderOtp({ onValueChange, validationType: 'numeric' })

		fireEvent.change(screen.getByLabelText('Digit 1'), { target: { value: 'x' } })

		expect(onValueChange).not.toHaveBeenCalled()
	})
})
