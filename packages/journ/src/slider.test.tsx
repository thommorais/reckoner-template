import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './slider'

const renderSlider = (props: React.ComponentProps<typeof Slider.Root> = {}, thumbs = ['Budget']) =>
	render(
		<Slider.Root defaultValue={[30]} {...props}>
			<Slider.Track>
				<Slider.Range />
			</Slider.Track>
			{thumbs.map(label => (
				<Slider.Thumb key={label} aria-label={label} />
			))}
		</Slider.Root>,
	)

describe('Slider', () => {
	it('shows the default value on the thumb', () => {
		renderSlider()

		expect(screen.getByRole('slider', { name: 'Budget' }).getAttribute('aria-valuenow')).toBe('30')
	})

	it('moves with the arrow keys and reports the change', () => {
		const onValueChange = vi.fn()
		renderSlider({ onValueChange })
		const thumb = screen.getByRole('slider')

		fireEvent.keyDown(thumb, { key: 'ArrowRight' })

		expect(thumb.getAttribute('aria-valuenow')).toBe('31')
		expect(onValueChange).toHaveBeenCalledWith([31])
	})

	it('supports a range with one thumb per value', () => {
		renderSlider({ defaultValue: [20, 80] }, ['Min', 'Max'])

		expect(screen.getAllByRole('slider').map(thumb => thumb.getAttribute('aria-valuenow'))).toEqual(['20', '80'])
	})

	it('ignores keys when disabled', () => {
		renderSlider({ disabled: true })
		const thumb = screen.getByRole('slider')

		fireEvent.keyDown(thumb, { key: 'ArrowRight' })

		expect(thumb.getAttribute('aria-valuenow')).toBe('30')
	})
})
