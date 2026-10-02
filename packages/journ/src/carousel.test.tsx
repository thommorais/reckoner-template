import { act, fireEvent, render, screen } from '@testing-library/react'
import useEmblaCarousel from 'embla-carousel-react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Carousel } from './carousel'

const embla = vi.hoisted(() => {
	const handlers: Record<string, () => void> = {}
	const api = {
		scrollPrev: vi.fn(),
		scrollNext: vi.fn(),
		canScrollPrev: vi.fn(() => false),
		canScrollNext: vi.fn(() => true),
		on: vi.fn((event: string, handler: () => void) => {
			handlers[event] = handler
		}),
		off: vi.fn(),
	}
	return { api, handlers }
})

vi.mock('embla-carousel-react', () => ({ default: vi.fn(() => [vi.fn(), embla.api]) }))

const renderCarousel = (props: React.ComponentProps<typeof Carousel.Root> = {}) =>
	render(
		<Carousel.Root aria-label='Reports' {...props}>
			<Carousel.Content>
				<Carousel.Item>One</Carousel.Item>
				<Carousel.Item>Two</Carousel.Item>
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>,
	)

const previous = () => screen.getByRole('button', { name: 'Previous slide' })
const next = () => screen.getByRole('button', { name: 'Next slide' })

describe('Carousel', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		embla.api.canScrollPrev.mockReturnValue(false)
		embla.api.canScrollNext.mockReturnValue(true)
	})

	it('renders an accessible region of slides', () => {
		renderCarousel()

		expect(screen.getByRole('region', { name: 'Reports' }).getAttribute('aria-roledescription')).toBe('carousel')
		expect(screen.getAllByRole('group').map(slide => slide.getAttribute('aria-roledescription'))).toEqual([
			'slide',
			'slide',
		])
	})

	it('disables the buttons at the ends', () => {
		renderCarousel()

		expect(previous().hasAttribute('disabled')).toBe(true)
		expect(next().hasAttribute('disabled')).toBe(false)
	})

	it('scrolls from the buttons', () => {
		renderCarousel()

		fireEvent.click(next())

		expect(embla.api.scrollNext).toHaveBeenCalledTimes(1)
	})

	it('updates the buttons when the selected slide changes', () => {
		renderCarousel()
		embla.api.canScrollPrev.mockReturnValue(true)
		embla.api.canScrollNext.mockReturnValue(false)

		act(() => embla.handlers.select?.())

		expect(previous().hasAttribute('disabled')).toBe(false)
		expect(next().hasAttribute('disabled')).toBe(true)
	})

	it('moves with the arrow keys', () => {
		renderCarousel()
		const region = screen.getByRole('region')

		fireEvent.keyDown(region, { key: 'ArrowRight' })
		fireEvent.keyDown(region, { key: 'ArrowLeft' })

		expect(embla.api.scrollNext).toHaveBeenCalledTimes(1)
		expect(embla.api.scrollPrev).toHaveBeenCalledTimes(1)
	})

	it('uses the vertical axis and the up and down keys when vertical', () => {
		renderCarousel({ orientation: 'vertical' })
		const region = screen.getByRole('region')

		fireEvent.keyDown(region, { key: 'ArrowDown' })
		fireEvent.keyDown(region, { key: 'ArrowRight' })

		expect(embla.api.scrollNext).toHaveBeenCalledTimes(1)
		expect(vi.mocked(useEmblaCarousel).mock.calls[0]?.[0]).toMatchObject({ axis: 'y' })
	})

	it('stops listening when it unmounts', () => {
		const { unmount } = renderCarousel()

		unmount()

		expect(embla.api.off).toHaveBeenCalledWith('select', expect.any(Function))
	})
})
