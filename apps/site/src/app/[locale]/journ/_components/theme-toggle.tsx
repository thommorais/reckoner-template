'use client'

import { ToggleGroup } from 'journ/toggle-group'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

const storageKey = 'journ-theme'

/** A class on <html> overrides the OS preference; no class follows it. */
const apply = (theme: Theme) => {
	const root = document.documentElement
	root.classList.remove('light', 'dark')
	if (theme !== 'system') root.classList.add(theme)
}

const ThemeToggle = () => {
	const [theme, setTheme] = useState<Theme>('system')

	useEffect(() => {
		try {
			const saved = localStorage.getItem(storageKey)
			if (saved === 'light' || saved === 'dark') {
				setTheme(saved)
				apply(saved)
			}
		} catch {}
	}, [])

	const change = (next: string) => {
		if (!next) return
		setTheme(next as Theme)
		apply(next as Theme)
		try {
			localStorage.setItem(storageKey, next)
		} catch {}
	}

	return (
		<ToggleGroup.Root
			type='single'
			value={theme}
			onValueChange={change}
			aria-label='Theme'
			className='bg-journ-surface ring-journ-foreground/10 dark:bg-journ-surface-dark dark:ring-journ-foreground-dark/10 fixed top-3 right-3 z-30 shadow-lg ring-1'
		>
			<ToggleGroup.Item value='system' aria-label='System theme' className='px-3'>
				<Monitor />
			</ToggleGroup.Item>
			<ToggleGroup.Item value='light' aria-label='Light theme' className='px-3'>
				<Sun />
			</ToggleGroup.Item>
			<ToggleGroup.Item value='dark' aria-label='Dark theme' className='px-3'>
				<Moon />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	)
}

export { ThemeToggle }
