import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuantityInput } from './quantity-input'

const renderInput = (props: React.ComponentProps<typeof QuantityInput.Root> = {}) =>
	render(
		<QuantityInput.Root {...props}>
			<QuantityInput.Decrement />
			<QuantityInput.Field aria-label='Quantity' />
			<QuantityInput.Increment />
		</QuantityInput.Root>,
	)

const field = () => screen.getByRole('spinbutton', { name: 'Quantity' }) as HTMLInputElement
const minus = () => screen.getByRole('button', { name: 'Decrease' })
const plus = () => screen.getByRole('button', { name: 'Increase' })

describe('QuantityInput', () => {
	it('shows the default value', () => {
		renderInput({ defaultValue: 3 })

		expect(field().value).toBe('3')
		expect(field().getAttribute('aria-valuenow')).toBe('3')
	})

	it('steps with the buttons and reports each change', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: 3, step: 2, onValueChange })

		fireEvent.click(plus())
		expect(field().value).toBe('5')

		fireEvent.click(minus())
		fireEvent.click(minus())
		expect(field().value).toBe('1')
		expect(onValueChange).toHaveBeenNthCalledWith(1, 5)
		expect(onValueChange).toHaveBeenLastCalledWith(1)
	})

	it('stops at the bounds and disables the matching button', () => {
		renderInput({ defaultValue: 1, min: 0, max: 2 })

		fireEvent.click(plus())
		expect(field().value).toBe('2')
		expect(plus().hasAttribute('disabled')).toBe(true)

		fireEvent.click(minus())
		fireEvent.click(minus())
		expect(field().value).toBe('0')
		expect(minus().hasAttribute('disabled')).toBe(true)
		expect(field().getAttribute('aria-valuemin')).toBe('0')
		expect(field().getAttribute('aria-valuemax')).toBe('2')
	})

	it('lets you type freely, then clamps on blur', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: 1, max: 10, onValueChange })

		fireEvent.change(field(), { target: { value: '99' } })
		expect(field().value).toBe('99')
		expect(onValueChange).not.toHaveBeenCalled()

		fireEvent.blur(field())
		expect(field().value).toBe('10')
		expect(onValueChange).toHaveBeenCalledWith(10)
	})

	it('commits on Enter and keeps the old value for text that is not a number', () => {
		renderInput({ defaultValue: 4 })

		fireEvent.change(field(), { target: { value: '7' } })
		fireEvent.keyDown(field(), { key: 'Enter' })
		expect(field().value).toBe('7')

		fireEvent.change(field(), { target: { value: 'abc' } })
		fireEvent.blur(field())
		expect(field().value).toBe('7')
	})

	it('steps with the arrow keys', () => {
		renderInput({ defaultValue: 5 })

		fireEvent.keyDown(field(), { key: 'ArrowUp' })
		fireEvent.keyDown(field(), { key: 'ArrowUp' })
		fireEvent.keyDown(field(), { key: 'ArrowDown' })

		expect(field().value).toBe('6')
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<QuantityInput.Root value={2}>
				<QuantityInput.Field aria-label='Quantity' />
			</QuantityInput.Root>,
		)
		expect(field().value).toBe('2')

		rerender(
			<QuantityInput.Root value={9}>
				<QuantityInput.Field aria-label='Quantity' />
			</QuantityInput.Root>,
		)
		expect(field().value).toBe('9')
	})

	it('is inert when disabled', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: 1, disabled: true, onValueChange })

		fireEvent.click(plus())

		expect(field().disabled).toBe(true)
		expect(onValueChange).not.toHaveBeenCalled()
	})
})
