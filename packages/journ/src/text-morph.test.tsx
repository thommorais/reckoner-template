import { animate } from 'animejs'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TextMorph } from './text-morph'

vi.mock('animejs', () => ({ animate: vi.fn() }))

const animated = () => vi.mocked(animate).mock.calls.map(([element]) => (element as HTMLElement).textContent)

describe('TextMorph', () => {
	beforeEach(() => vi.clearAllMocks())

	it('gives screen readers the whole text once and splits it into characters visually', () => {
		const { container } = render(<TextMorph>Hello</TextMorph>)

		expect(screen.getByText('Hello', { selector: '.sr-only' })).toBeTruthy()
		expect([...container.querySelectorAll('[data-char]')].map(char => char.textContent)).toEqual([
			'H',
			'e',
			'l',
			'l',
			'o',
		])
	})

	it('does not animate on the first render', () => {
		render(<TextMorph>Hello</TextMorph>)

		expect(animate).not.toHaveBeenCalled()
	})

	it('animates only the characters that changed', () => {
		const { rerender } = render(<TextMorph>Hello</TextMorph>)

		rerender(<TextMorph>Help!</TextMorph>)

		expect(animated()).toEqual(['p', '!'])
	})

	it('staggers the animated characters', () => {
		const { rerender } = render(<TextMorph>abc</TextMorph>)

		rerender(<TextMorph>xyz</TextMorph>)

		expect(vi.mocked(animate).mock.calls.map(([, keyframes]) => (keyframes as { delay: number }).delay)).toEqual([
			0, 18, 36,
		])
	})

	it('does nothing when the text is unchanged', () => {
		const { rerender } = render(<TextMorph>Same</TextMorph>)

		rerender(<TextMorph>Same</TextMorph>)

		expect(animate).not.toHaveBeenCalled()
	})

	it('animates new characters when the text grows', () => {
		const { rerender } = render(<TextMorph>Hi</TextMorph>)

		rerender(<TextMorph>Hi!</TextMorph>)

		expect(animated()).toEqual(['!'])
	})
})
