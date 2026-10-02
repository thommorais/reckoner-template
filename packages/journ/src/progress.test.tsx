import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Progress } from './progress'

describe('Progress', () => {
	it('exposes the value and moves the indicator by the percentage', () => {
		render(
			<Progress.Root value={25} aria-label='Upload'>
				<Progress.Indicator data-testid='bar' />
			</Progress.Root>,
		)

		expect(screen.getByRole('progressbar', { name: 'Upload' }).getAttribute('aria-valuenow')).toBe('25')
		expect(screen.getByTestId('bar').style.transform).toBe('translateX(-75%)')
	})

	it('uses max to compute the percentage and clamps out of range values', () => {
		render(
			<Progress.Root value={150} max={100} aria-label='Over'>
				<Progress.Indicator data-testid='bar' />
			</Progress.Root>,
		)

		expect(screen.getByTestId('bar').style.transform).toBe('translateX(-0%)')
	})

	it('rejects an indicator outside a root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<Progress.Indicator />)).toThrow('Progress.Root')

		spy.mockRestore()
	})
})
