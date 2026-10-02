import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateInput } from './date-input'
import { datePlaceholder, parseDate } from './lib/parse-date'

describe('parseDate', () => {
	it('reads ISO dates', () => {
		expect(parseDate('2024-01-15')).toEqual(new Date(2024, 0, 15))
	})

	it('follows the locale order', () => {
		expect(parseDate('01/15/2024', 'en')).toEqual(new Date(2024, 0, 15))
		expect(parseDate('15/01/2024', 'pt-BR')).toEqual(new Date(2024, 0, 15))
	})

	it('accepts other separators and two digit years', () => {
		expect(parseDate('15.1.24', 'pt-BR')).toEqual(new Date(2024, 0, 15))
		expect(parseDate('1 15 2024', 'en')).toEqual(new Date(2024, 0, 15))
	})

	it('rejects impossible dates and noise', () => {
		expect(parseDate('02/31/2024', 'en')).toBeNull()
		expect(parseDate('13/01/2024', 'en')).toBeNull()
		expect(parseDate('hello', 'en')).toBeNull()
		expect(parseDate('', 'en')).toBeNull()
	})

	it('builds a placeholder from the locale', () => {
		expect(datePlaceholder('en')).toBe('mm/dd/yyyy')
		expect(datePlaceholder('pt-BR')).toBe('dd/mm/yyyy')
	})
})

const renderInput = (props: React.ComponentProps<typeof DateInput.Root> = {}) =>
	render(
		<DateInput.Root {...props}>
			<DateInput.Field aria-label='Date' />
		</DateInput.Root>,
	)

describe('DateInput', () => {
	it('shows the locale placeholder', () => {
		renderInput({ locale: 'pt-BR' })

		expect(screen.getByLabelText('Date').getAttribute('placeholder')).toBe('dd/mm/yyyy')
	})

	it('commits a valid date on blur and normalizes the text', () => {
		const onValueChange = vi.fn()
		renderInput({ onValueChange })
		const input = screen.getByLabelText('Date') as HTMLInputElement

		fireEvent.change(input, { target: { value: '1-5-2024' } })
		fireEvent.blur(input)

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 5))
		expect(input.value).toBe('01/05/2024')
		expect(input.getAttribute('aria-invalid')).toBeNull()
	})

	it('commits on Enter', () => {
		const onValueChange = vi.fn()
		renderInput({ onValueChange })
		const input = screen.getByLabelText('Date')

		fireEvent.change(input, { target: { value: '2024-03-09' } })
		fireEvent.keyDown(input, { key: 'Enter' })

		expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 9))
	})

	it('marks invalid text and does not commit, then clears on typing', () => {
		const onValueChange = vi.fn()
		renderInput({ onValueChange })
		const input = screen.getByLabelText('Date')

		fireEvent.change(input, { target: { value: '99/99/2024' } })
		fireEvent.blur(input)

		expect(input.getAttribute('aria-invalid')).toBe('true')
		expect(onValueChange).not.toHaveBeenCalled()

		fireEvent.change(input, { target: { value: '01/01/2024' } })
		expect(input.getAttribute('aria-invalid')).toBeNull()
	})

	it('clears the date when the text is emptied', () => {
		const onValueChange = vi.fn()
		renderInput({ defaultValue: new Date(2024, 0, 15), onValueChange })
		const input = screen.getByLabelText('Date') as HTMLInputElement
		expect(input.value).toBe('01/15/2024')

		fireEvent.change(input, { target: { value: '' } })
		fireEvent.blur(input)

		expect(onValueChange).toHaveBeenCalledWith(null)
	})
})
