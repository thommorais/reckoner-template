import { useState } from 'react'

/**
 * Text that is typed freely and only turns into a value on commit. While not
 * editing it shows `format(value)`. `parse` returns undefined to reject the
 * text, which keeps the old value.
 */
const useDraft = <T>({
	value,
	format,
	parse,
	onCommit,
}: {
	value: T
	format: (value: T) => string
	parse: (text: string) => T | undefined
	onCommit: (value: T) => void
}) => {
	const [draft, setDraft] = useState<string | null>(null)

	return {
		text: draft ?? format(value),
		edit: setDraft,
		discard: () => setDraft(null),
		commit: () => {
			const parsed = parse(draft ?? '')
			if (parsed !== undefined) onCommit(parsed)
			setDraft(null)
		},
	}
}

export { useDraft }
