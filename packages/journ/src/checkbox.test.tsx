import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
	it('toggles on click and reports the change', () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox aria-label='Accept' onCheckedChange={onCheckedChange} />)
		const control = screen.getByRole('checkbox', { name: 'Accept' })

		expect(control.getAttribute('aria-checked')).toBe('false')
		fireEvent.click(control)

		expect(control.getAttribute('aria-checked')).toBe('true')
		expect(onCheckedChange).toHaveBeenCalledWith(true)
		fireEvent.click(control)
		expect(onCheckedChange).toHaveBeenLastCalledWith(false)
	})

	it('exposes the indeterminate state', () => {
		render(<Checkbox aria-label='All' checked='indeterminate' />)

		expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed')
	})

	it('does not toggle when disabled', () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox aria-label='Accept' disabled onCheckedChange={onCheckedChange} />)

		fireEvent.click(screen.getByRole('checkbox'))

		expect(onCheckedChange).not.toHaveBeenCalled()
	})
})
