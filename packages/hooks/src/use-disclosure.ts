import { useCallback, useEffectEvent, useState } from 'react'
import { useDidUpdate } from './use-did-update'

type UseDisclosureOptions = {
	onOpen?: () => void
	onClose?: () => void
}

type UseDisclosureHandlers = {
	set: (value: boolean) => void
	open: () => void
	close: () => void
	toggle: () => void
}

type UseDisclosureReturnValue = [boolean, UseDisclosureHandlers]

const useDisclosure = (
	initialState = false,
	{ onOpen, onClose }: UseDisclosureOptions = {},
): UseDisclosureReturnValue => {
	const [opened, setOpened] = useState(initialState)

	const notify = useEffectEvent((isOpen: boolean) => (isOpen ? onOpen?.() : onClose?.()))

	useDidUpdate(() => notify(opened), [opened])

	const open = useCallback(() => setOpened(true), [])
	const close = useCallback(() => setOpened(false), [])
	const toggle = useCallback(() => setOpened(current => !current), [])

	return [opened, { open, close, toggle, set: setOpened }]
}

export { useDisclosure }

export type { UseDisclosureHandlers, UseDisclosureOptions, UseDisclosureReturnValue }
