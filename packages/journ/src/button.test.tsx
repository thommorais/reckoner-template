import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
	it('runs onClick when idle', () => {
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Save</Button>)

		fireEvent.click(screen.getByRole('button', { name: 'Save' }))

		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.getByRole('button').getAttribute('aria-busy')).toBeNull()
	})

	it('shows a spinner, marks itself busy and ignores presses while pending', () => {
		const onClick = vi.fn()
		render(
			<Button pending onClick={onClick}>
				Save
			</Button>,
		)
		const button = screen.getByRole('button', { name: 'Save' })

		fireEvent.click(button)

		expect(button.getAttribute('aria-busy')).toBe('true')
		expect(button.dataset.pending).toBe('true')
		expect(button.querySelector('[data-slot=spinner]')).not.toBeNull()
		expect(onClick).not.toHaveBeenCalled()
	})

	it('hides the spinner from assistive tech so the label stays the name', () => {
		render(<Button pending>Save</Button>)

		expect(screen.queryByRole('status')).toBeNull()
		expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
	})

	it('also works as a link', () => {
		const onClick = vi.fn()
		render(
			<Button href='/reports' pending onClick={onClick}>
				Open
			</Button>,
		)

		fireEvent.click(screen.getByRole('link', { name: 'Open' }))

		expect(screen.getByRole('link').getAttribute('aria-busy')).toBe('true')
		expect(onClick).not.toHaveBeenCalled()
	})
})
