'use client'

import { animate } from 'animejs'
import { useCallback, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties } from 'react'
import { cn } from './lib/cn'
import { pressReset } from './lib/interactive'
import { surfaceTones } from './lib/tones'
import { tv, type VariantProps } from './lib/tv'
import { prefersReducedMotion } from './lib/use-enter'
import { displayTitle } from './lib/text-styles'
import { createRequiredContext } from './lib/required-context'

type StackContextValue = {
	active: string
	history: string[]
	activate: (value: string) => void
	register: (value: string, element: HTMLElement | null) => void
}

const [StackContext, useStack] = createRequiredContext<StackContextValue>('Stack.Root')
const [ItemContext, useItemValue] = createRequiredContext<string>('Stack.Item')

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
	defaultValue: string
	onValueChange?: (value: string) => void
}

/**
 * Activating an item moves it to the end of the stack (the front) and the
 * remaining items keep their relative order. Positions are animated with a FLIP
 * transition so every item glides to its new place.
 */
const Root = ({ defaultValue, onValueChange, className, ...props }: RootProps) => {
	const [history, setHistory] = useState([defaultValue])
	const elements = useRef(new Map<string, HTMLElement>())
	const firstRects = useRef<Map<string, number> | null>(null)
	const active = history[history.length - 1] ?? defaultValue

	const register = useCallback((value: string, element: HTMLElement | null) => {
		if (element) elements.current.set(value, element)
		else elements.current.delete(value)
	}, [])

	const activate = useCallback(
		(value: string) => {
			if (value === active) return
			firstRects.current = new Map(
				[...elements.current].map(([key, element]) => [key, element.getBoundingClientRect().top]),
			)
			setHistory(current => [...current.filter(entry => entry !== value), value])
			onValueChange?.(value)
		},
		[active, onValueChange],
	)

	useLayoutEffect(() => {
		const first = firstRects.current
		firstRects.current = null
		if (!first || prefersReducedMotion()) return

		for (const [value, element] of elements.current) {
			const previous = first.get(value)
			if (previous === undefined) continue
			const delta = previous - element.getBoundingClientRect().top
			if (delta !== 0) animate(element, { translateY: [delta, 0], duration: 300, ease: 'outExpo' })
		}
	}, [history])

	return (
		<StackContext value={{ active, history, activate, register }}>
			<div data-slot='stack' {...props} className={cn('flex flex-col pt-6', className)} />
		</StackContext>
	)
}

const stackItem = tv({
	base: 'rounded-journ relative -mt-6 flex flex-col gap-3 p-5 pb-9 data-[active=true]:pb-5',
	variants: { tone: surfaceTones },
	defaultVariants: { tone: 'dark' },
})

type ItemProps = Omit<ComponentPropsWithRef<'div'>, 'ref'> &
	VariantProps<typeof stackItem> & {
		value: string
	}

const Item = ({ value, tone, className, style, ...props }: ItemProps) => {
	const { active, history, register } = useStack()
	const position = history.indexOf(value) + 1
	const itemStyle: CSSProperties = { ...style, order: position, zIndex: position }

	return (
		<ItemContext value={value}>
			<div
				data-slot='stack-item'
				data-value={value}
				data-active={active === value}
				ref={element => {
					register(value, element)
					return () => register(value, null)
				}}
				{...props}
				style={itemStyle}
				className={stackItem({ tone, class: className })}
			/>
		</ItemContext>
	)
}

const Trigger = ({ className, onClick, ...props }: ComponentPropsWithRef<'button'>) => {
	const { active, activate } = useStack()
	const value = useItemValue()

	return (
		<button
			type='button'
			data-slot='stack-trigger'
			aria-expanded={active === value}
			{...props}
			onClick={event => {
				onClick?.(event)
				activate(value)
			}}
			className={cn(
				pressReset,
				displayTitle,
				'flex w-full cursor-pointer items-start justify-between gap-4 rounded-journ text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-journ-sky',
				className,
			)}
		/>
	)
}

const Content = ({ className, ...props }: ComponentPropsWithRef<'div'>) => {
	const { active } = useStack()
	const value = useItemValue()
	const isActive = active === value
	const element = useRef<HTMLDivElement>(null)
	const mounted = useRef(false)

	useLayoutEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		if (!isActive || !element.current || prefersReducedMotion()) return
		animate(element.current, { opacity: [0, 1], translateY: [12, 0], duration: 250, delay: 100, ease: 'outExpo' })
	}, [isActive])

	return (
		<div
			ref={element}
			data-slot='stack-content'
			data-active={isActive}
			inert={!isActive}
			{...props}
			className={cn('flex flex-col gap-3 data-[active=false]:hidden', className)}
		/>
	)
}

export { Root, Item, Trigger, Content }
