import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

const renderCheckbox = (props: React.ComponentProps<typeof Checkbox.Root> = {}) =>
	render(
		<Checkbox.Root aria-label='Accept' {...props}>
			<Checkbox.Indicator />
		</Checkbox.Root>,
	)

describe('Checkbox', () => {
	it('toggles on click and reports the change', () => {
		const onCheckedChange = vi.fn()
		renderCheckbox({ onCheckedChange })
		const control = screen.getByRole('checkbox', { name: 'Accept' })

		expect(control.getAttribute('aria-checked')).toBe('false')
		fireEvent.click(control)

		expect(control.getAttribute('aria-checked')).toBe('true')
		expect(onCheckedChange).toHaveBeenCalledWith(true)
		fireEvent.click(control)
		expect(onCheckedChange).toHaveBeenLastCalledWith(false)
	})

	it('exposes the indeterminate state, also when uncontrolled', () => {
		renderCheckbox({ defaultChecked: 'indeterminate' })

		expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed')
	})

	it('does not toggle when disabled', () => {
		const onCheckedChange = vi.fn()
		renderCheckbox({ disabled: true, onCheckedChange })

		fireEvent.click(screen.getByRole('checkbox'))

		expect(onCheckedChange).not.toHaveBeenCalled()
	})
})
