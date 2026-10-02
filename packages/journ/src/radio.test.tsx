import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Radio } from './radio'

const renderGroup = (onValueChange?: (value: string) => void) =>
	render(
		<Radio.Group defaultValue='a' onValueChange={onValueChange} aria-label='Choice'>
			<Radio.Item value='a' aria-label='A' />
			<Radio.Item value='b' aria-label='B' />
			<Radio.Item value='c' aria-label='C' disabled />
		</Radio.Group>,
	)

describe('Radio', () => {
	it('checks the default item', () => {
		renderGroup()

		expect(screen.getByRole('radio', { name: 'A' }).getAttribute('aria-checked')).toBe('true')
		expect(screen.getByRole('radio', { name: 'B' }).getAttribute('aria-checked')).toBe('false')
	})

	it('moves the selection and reports it', () => {
		const onValueChange = vi.fn()
		renderGroup(onValueChange)

		fireEvent.click(screen.getByRole('radio', { name: 'B' }))

		expect(screen.getByRole('radio', { name: 'B' }).getAttribute('aria-checked')).toBe('true')
		expect(screen.getByRole('radio', { name: 'A' }).getAttribute('aria-checked')).toBe('false')
		expect(onValueChange).toHaveBeenCalledWith('b')
	})

	it('ignores disabled items', () => {
		const onValueChange = vi.fn()
		renderGroup(onValueChange)

		fireEvent.click(screen.getByRole('radio', { name: 'C' }))

		expect(onValueChange).not.toHaveBeenCalled()
	})
})
