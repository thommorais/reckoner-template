import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyInput } from './currency-input'
import { parseLocalizedNumber } from './lib/number'

describe('parseLocalizedNumber', () => {
	it('reads symbols, spaces and the locale separators', () => {
		expect(parseLocalizedNumber('$1,234.50', 'en')).toBe(1234.5)
		expect(parseLocalizedNumber('R$ 1.234,56', 'pt-BR')).toBe(1234.56)
		expect(parseLocalizedNumber('-42', 'en')).toBe(-42)
	})

	it('treats a lone separator that is not a thousands group as the decimal point', () => {
		expect(parseLocalizedNumber('12.5', 'pt-BR')).toBe(12.5)
		expect(parseLocalizedNumber('1,5', 'en')).toBe(1.5)
		expect(parseLocalizedNumber('1,234', 'en')).toBe(1234)
	})

	it('returns null when there is no number', () => {
		expect(parseLocalizedNumber('abc', 'en')).toBeNull()
		expect(parseLocalizedNumber('', 'en')).toBeNull()
	})
})

const renderInput = (props: React.ComponentProps<typeof CurrencyInput.Root> = {}) =>
	render(
		<CurrencyInput.Root {...props}>
			<CurrencyInput.Field aria-label='Amount' />
		</CurrencyInput.Root>,
	)

const field = () => screen.getByLabelText('Amount') as HTMLInputElement

describe('CurrencyInput', () => {
	it('shows the amount formatted when idle', () => {
		renderInput({ defaultValue: 1234.5 })

		expect(field().value).toBe('$1,234.50')
	})

	it('switches to plain digits to edit, then formats on blur and reports the amount', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: 1234.5, onValueChange })

		fireEvent.focus(field())
		expect(field().value).toBe('1234.5')

		fireEvent.change(field(), { target: { value: '2,500.75' } })
		fireEvent.blur(field())

		expect(onValueChange).toHaveBeenCalledWith(2500.75)
		expect(field().value).toBe('$2,500.75')
	})

	it('commits on Enter', () => {
		const onValueChange = vi.fn()
		renderInput({ onValueChange })

		fireEvent.focus(field())
		fireEvent.change(field(), { target: { value: '40' } })
		fireEvent.keyDown(field(), { key: 'Enter' })

		expect(onValueChange).toHaveBeenCalledWith(40)
	})

	it('follows the locale and currency', () => {
		renderInput({ locale: 'pt-BR', currency: 'BRL', defaultValue: 1234.5 })
		expect(field().value).toContain('1.234,50')

		fireEvent.focus(field())
		expect(field().value).toBe('1234,5')

		fireEvent.change(field(), { target: { value: '12.5' } })
		fireEvent.blur(field())
		expect(field().value).toContain('12,50')
	})

	it('snaps to the bounds', () => {
		const onValueChange = vi.fn()
		renderInput({ min: 0, max: 100, onValueChange })

		fireEvent.focus(field())
		fireEvent.change(field(), { target: { value: '250' } })
		fireEvent.blur(field())

		expect(onValueChange).toHaveBeenCalledWith(100)
	})

	it('clears when the text is emptied and ignores text that is not a number', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: 10, onValueChange })

		fireEvent.focus(field())
		fireEvent.change(field(), { target: { value: 'abc' } })
		fireEvent.blur(field())
		expect(onValueChange).not.toHaveBeenCalled()
		expect(field().value).toBe('$10.00')

		fireEvent.focus(field())
		fireEvent.change(field(), { target: { value: '' } })
		fireEvent.blur(field())
		expect(onValueChange).toHaveBeenCalledWith(null)
		expect(field().value).toBe('')
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<CurrencyInput.Root value={5}>
				<CurrencyInput.Field aria-label='Amount' />
			</CurrencyInput.Root>,
		)
		expect(field().value).toBe('$5.00')

		rerender(
			<CurrencyInput.Root value={9.5}>
				<CurrencyInput.Field aria-label='Amount' />
			</CurrencyInput.Root>,
		)
		expect(field().value).toBe('$9.50')
	})
})
