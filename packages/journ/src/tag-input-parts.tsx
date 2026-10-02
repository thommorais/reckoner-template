'use client'

import { useState, type ClipboardEvent, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Chip } from './chip'
import { Composer } from './composer'
import { cn } from './lib/cn'
import { createRequiredContext } from './lib/required-context'
import { useControllableState } from './lib/use-controllable-state'

type TagInputContextValue = {
	tags: string[]
	text: string
	invalid: boolean
	setText: (text: string) => void
	add: (...tags: string[]) => void
	remove: (tag: string) => void
	removeLast: () => void
}

const [TagInputContext, useTagInput] = createRequiredContext<TagInputContextValue>('TagInput.Root')

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> & {
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (tags: string[]) => void
	/** Return false to refuse a tag, e.g. an invalid email. The text stays so it can be fixed. */
	validate?: (tag: string) => boolean
	children?: ReactNode
}

const none: string[] = []

/** Tags are trimmed, unique (ignoring case) and never empty. */
const Root = ({ value, defaultValue = none, onValueChange, validate, className, children, ...props }: RootProps) => {
	const [stored, setStored] = useControllableState(value, defaultValue, onValueChange)
	const tags = stored ?? none
	const [text, setText] = useState('')
	const [invalid, setInvalid] = useState(false)

	const add = (...incoming: string[]) => {
		const next = [...tags]
		let refused = false
		for (const raw of incoming) {
			const tag = raw.trim()
			if (!tag || next.some(existing => existing.toLowerCase() === tag.toLowerCase())) continue
			if (validate && !validate(tag)) {
				refused = true
				continue
			}
			next.push(tag)
		}
		setInvalid(refused)
		if (next.length !== tags.length) setStored(next)
		if (!refused) setText('')
	}

	return (
		<TagInputContext
			value={{
				tags,
				text,
				invalid,
				setText: next => (setInvalid(false), setText(next)),
				add,
				remove: tag => setStored(tags.filter(existing => existing !== tag)),
				removeLast: () => tags.length > 0 && setStored(tags.slice(0, -1)),
			}}
		>
			<Composer.Root data-slot='tag-input' {...props} className={cn('flex-wrap rounded-3xl', className)}>
				{children}
			</Composer.Root>
		</TagInputContext>
	)
}

const Tag = ({
	value,
	...props
}: Omit<ComponentPropsWithRef<typeof Chip.Tag>, 'children' | 'onRemove'> & { value: string }) => {
	const { remove } = useTagInput()

	return (
		<Chip.Tag data-slot='tag-input-tag' removeLabel={`Remove ${value}`} onRemove={() => remove(value)} {...props}>
			{value}
		</Chip.Tag>
	)
}

/** One `Tag` per value. Use `useTagInput` and `Tag` yourself for a custom list. */
const Tags = () => {
	const { tags } = useTagInput()
	return tags.map(tag => <Tag key={tag} value={tag} />)
}

const Field = ({ className, onKeyDown, onBlur, onPaste, ...props }: ComponentPropsWithRef<typeof Composer.Input>) => {
	const { text, invalid, setText, add, removeLast } = useTagInput()

	return (
		<Composer.Input
			data-slot='tag-input-field'
			aria-invalid={invalid || undefined}
			{...props}
			value={text}
			onChange={event => setText(event.target.value)}
			onKeyDown={event => {
				onKeyDown?.(event)
				if (event.key === 'Enter' || event.key === ',') {
					event.preventDefault()
					add(text)
				}
				if (event.key === 'Backspace' && text === '') removeLast()
			}}
			onBlur={event => {
				onBlur?.(event)
				add(text)
			}}
			onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
				onPaste?.(event)
				const pasted = event.clipboardData.getData('text')
				if (/[,\n;]/.test(pasted)) {
					event.preventDefault()
					add(...pasted.split(/[,\n;]+/))
				}
			}}
			className={cn('min-w-24', className)}
		/>
	)
}

export { Root, Tag, Tags, Field, useTagInput }
export type { RootProps }
