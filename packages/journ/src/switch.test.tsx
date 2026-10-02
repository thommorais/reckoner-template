import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './switch'

describe('Switch', () => {
	it('toggles on click and reports the change', () => {
		const onCheckedChange = vi.fn()
		render(<Switch aria-label='Alerts' onCheckedChange={onCheckedChange} />)
		const control = screen.getByRole('switch', { name: 'Alerts' })

		expect(control.getAttribute('aria-checked')).toBe('false')
		fireEvent.click(control)

		expect(control.getAttribute('aria-checked')).toBe('true')
		expect(onCheckedChange).toHaveBeenCalledWith(true)
	})

	it('respects defaultChecked', () => {
		render(<Switch aria-label='Alerts' defaultChecked />)

		expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true')
	})

	it('does not toggle when disabled', () => {
		const onCheckedChange = vi.fn()
		render(<Switch aria-label='Alerts' disabled onCheckedChange={onCheckedChange} />)

		fireEvent.click(screen.getByRole('switch'))

		expect(onCheckedChange).not.toHaveBeenCalled()
	})
})
