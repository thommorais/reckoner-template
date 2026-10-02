import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tabs } from './tabs'

const renderTabs = (onValueChange?: (value: string) => void) =>
	render(
		<Tabs.Root defaultValue='one' onValueChange={onValueChange}>
			<Tabs.List>
				<Tabs.Trigger value='one'>One</Tabs.Trigger>
				<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				<Tabs.Trigger value='three' disabled>
					Three
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='one'>Panel one</Tabs.Content>
			<Tabs.Content value='two'>Panel two</Tabs.Content>
			<Tabs.Content value='three'>Panel three</Tabs.Content>
		</Tabs.Root>,
	)

const select = (name: string) => fireEvent.mouseDown(screen.getByRole('tab', { name }), { button: 0, ctrlKey: false })

describe('Tabs', () => {
	it('shows only the default panel', () => {
		renderTabs()

		expect(screen.getByText('Panel one')).toBeTruthy()
		expect(screen.queryByText('Panel two')).toBeNull()
		expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true')
	})

	it('switches panels and reports the change', () => {
		const onValueChange = vi.fn()
		renderTabs(onValueChange)

		select('Two')

		expect(screen.getByText('Panel two')).toBeTruthy()
		expect(screen.queryByText('Panel one')).toBeNull()
		expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true')
		expect(onValueChange).toHaveBeenCalledWith('two')
	})

	it('ignores disabled tabs', () => {
		renderTabs()

		select('Three')

		expect(screen.queryByText('Panel three')).toBeNull()
		expect(screen.getByText('Panel one')).toBeTruthy()
	})
})
