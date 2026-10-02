import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portal } from './portal'

describe('Portal', () => {
	it('renders its children in document.body, outside the render tree', () => {
		const { container } = render(
			<div data-testid='host'>
				<Portal>
					<p>Floating</p>
				</Portal>
			</div>,
		)

		const floating = screen.getByText('Floating')
		expect(floating.parentElement).toBe(document.body)
		expect(container.contains(floating)).toBe(false)
	})

	it('renders into a given container', () => {
		const target = document.createElement('div')
		document.body.appendChild(target)

		render(
			<Portal container={target}>
				<p>Inside target</p>
			</Portal>,
		)

		expect(target.textContent).toBe('Inside target')
		target.remove()
	})

	it('removes the children when it unmounts', () => {
		const { unmount } = render(
			<Portal>
				<p>Gone soon</p>
			</Portal>,
		)
		expect(screen.getByText('Gone soon')).toBeTruthy()

		unmount()

		expect(screen.queryByText('Gone soon')).toBeNull()
	})
})
