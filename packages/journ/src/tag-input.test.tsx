import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TagInput } from './tag-input'

const renderInput = (props: React.ComponentProps<typeof TagInput.Root> = {}) =>
	render(
		<TagInput.Root {...props}>
			<TagInput.Tags />
			<TagInput.Field aria-label='Add tag' />
		</TagInput.Root>,
	)

const field = () => screen.getByLabelText('Add tag') as HTMLInputElement
const tags = () =>
	screen
		.queryAllByRole('button', { name: /^Remove / })
		.map(button => button.getAttribute('aria-label')?.replace('Remove ', ''))
const type = (text: string) => fireEvent.change(field(), { target: { value: text } })

describe('TagInput', () => {
	it('shows the default tags', () => {
		renderInput({ defaultValue: ['one', 'two'] })

		expect(tags()).toEqual(['one', 'two'])
	})

	it('adds a trimmed tag on Enter and clears the field', () => {
		const onValueChange = vi.fn()
		renderInput({ onValueChange })

		type('  alpha  ')
		fireEvent.keyDown(field(), { key: 'Enter' })

		expect(tags()).toEqual(['alpha'])
		expect(onValueChange).toHaveBeenCalledWith(['alpha'])
		expect(field().value).toBe('')
	})

	it('adds on a comma and on blur', () => {
		renderInput()

		type('beta')
		fireEvent.keyDown(field(), { key: ',' })
		type('gamma')
		fireEvent.blur(field())

		expect(tags()).toEqual(['beta', 'gamma'])
	})

	it('ignores empty text and duplicates regardless of case', () => {
		renderInput({ defaultValue: ['Alpha'] })

		type('   ')
		fireEvent.keyDown(field(), { key: 'Enter' })
		type('alpha')
		fireEvent.keyDown(field(), { key: 'Enter' })

		expect(tags()).toEqual(['Alpha'])
	})

	it('removes the last tag with Backspace on an empty field, but not while typing', () => {
		renderInput({ defaultValue: ['one', 'two'] })

		type('x')
		fireEvent.keyDown(field(), { key: 'Backspace' })
		expect(tags()).toEqual(['one', 'two'])

		type('')
		fireEvent.keyDown(field(), { key: 'Backspace' })
		expect(tags()).toEqual(['one'])
	})

	it('removes a tag with its button', () => {
		renderInput({ defaultValue: ['one', 'two', 'three'] })

		fireEvent.click(screen.getByRole('button', { name: 'Remove two' }))

		expect(tags()).toEqual(['one', 'three'])
	})

	it('refuses tags that fail validation, flags the field and keeps the text', () => {
		const validate = (tag: string) => tag.includes('@')
		renderInput({ validate })

		type('nope')
		fireEvent.keyDown(field(), { key: 'Enter' })

		expect(tags()).toEqual([])
		expect(field().getAttribute('aria-invalid')).toBe('true')
		expect(field().value).toBe('nope')

		type('ok@x.com')
		expect(field().getAttribute('aria-invalid')).toBeNull()
		fireEvent.keyDown(field(), { key: 'Enter' })
		expect(tags()).toEqual(['ok@x.com'])
	})

	it('splits pasted text on commas, semicolons and new lines', () => {
		renderInput()

		fireEvent.paste(field(), { clipboardData: { getData: () => 'a, b;c\nd' } })

		expect(tags()).toEqual(['a', 'b', 'c', 'd'])
	})

	it('follows a controlled value', () => {
		const { rerender } = render(
			<TagInput.Root value={['x']}>
				<TagInput.Tags />
			</TagInput.Root>,
		)
		expect(tags()).toEqual(['x'])

		rerender(
			<TagInput.Root value={['y', 'z']}>
				<TagInput.Tags />
			</TagInput.Root>,
		)
		expect(tags()).toEqual(['y', 'z'])
	})
})
