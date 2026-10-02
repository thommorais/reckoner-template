import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Stack } from './stack'

vi.mock('animejs', () => ({ animate: vi.fn() }))

const renderStack = (onValueChange?: (value: string) => void) =>
	render(
		<Stack.Root defaultValue='c' onValueChange={onValueChange}>
			<Stack.Item value='a'>
				<Stack.Trigger>A</Stack.Trigger>
				<Stack.Content>Content A</Stack.Content>
			</Stack.Item>
			<Stack.Item value='b'>
				<Stack.Trigger>B</Stack.Trigger>
				<Stack.Content>Content B</Stack.Content>
			</Stack.Item>
			<Stack.Item value='c'>
				<Stack.Trigger>C</Stack.Trigger>
				<Stack.Content>Content C</Stack.Content>
			</Stack.Item>
		</Stack.Root>,
	)

const item = (value: string) => document.querySelector<HTMLElement>(`[data-value="${value}"]`)!

describe('Stack', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('starts with the default item active and in front', () => {
		renderStack()

		expect(item('c').dataset.active).toBe('true')
		expect(screen.getByRole('button', { name: 'C' }).getAttribute('aria-expanded')).toBe('true')
		expect(screen.getByRole('button', { name: 'A' }).getAttribute('aria-expanded')).toBe('false')
		expect(Number(item('c').style.order)).toBeGreaterThan(Number(item('a').style.order))
	})

	it('brings a clicked item to the front and keeps the others in order', () => {
		renderStack()

		fireEvent.click(screen.getByRole('button', { name: 'A' }))

		expect(item('a').dataset.active).toBe('true')
		expect(item('c').dataset.active).toBe('false')
		expect(Number(item('a').style.order)).toBeGreaterThan(Number(item('c').style.order))
		expect(Number(item('c').style.order)).toBeGreaterThan(Number(item('b').style.order))
	})

	it('only exposes the content of the active item', () => {
		renderStack()

		expect(item('c').querySelector('[data-slot=stack-content]')?.hasAttribute('inert')).toBe(false)
		expect(item('a').querySelector('[data-slot=stack-content]')?.hasAttribute('inert')).toBe(true)

		fireEvent.click(screen.getByRole('button', { name: 'A' }))

		expect(item('a').querySelector('[data-slot=stack-content]')?.hasAttribute('inert')).toBe(false)
		expect(item('c').querySelector('[data-slot=stack-content]')?.hasAttribute('inert')).toBe(true)
	})

	it('reports changes and ignores a click on the active item', () => {
		const onValueChange = vi.fn()
		renderStack(onValueChange)

		fireEvent.click(screen.getByRole('button', { name: 'C' }))
		expect(onValueChange).not.toHaveBeenCalled()

		fireEvent.click(screen.getByRole('button', { name: 'B' }))
		expect(onValueChange).toHaveBeenCalledWith('b')
	})

	it('rejects parts rendered outside their parents', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		expect(() => render(<Stack.Trigger>x</Stack.Trigger>)).toThrow('Stack.Root')

		spy.mockRestore()
	})
})
