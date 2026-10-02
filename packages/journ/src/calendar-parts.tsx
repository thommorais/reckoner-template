'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createContext, use, useState, useSyncExternalStore, type ComponentPropsWithRef, type ReactNode } from 'react'
import { IconButton, type IconButtonProps } from './icon-button'
import { cn } from './lib/cn'
import { interactive } from './lib/interactive'
import { tv } from './lib/tv'
import { useControllableState } from './lib/use-controllable-state'

type CalendarView = 'days' | 'months' | 'years'
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

type CalendarState = {
	selected: Date | null
	month: Date
	view: CalendarView
}

type CalendarActions = {
	select: (date: Date) => void
	showMonth: (month: Date) => void
	showView: (view: CalendarView) => void
	previous: () => void
	next: () => void
}

type CalendarMeta = {
	locale?: string
	weekStartsOn: Weekday
}

type CalendarContextValue = {
	state: CalendarState
	actions: CalendarActions
	meta: CalendarMeta
}

const YEAR_PAGE_SIZE = 12

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)
const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
const isSameDay = (a: Date, b: Date | null) => b !== null && dayKey(a) === dayKey(b)
const isSameMonth = (a: Date, b: Date | null) =>
	b !== null && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const yearPageStart = (month: Date) => Math.floor(month.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE

const monthGrid = (month: Date, weekStartsOn: Weekday) => {
	const offset = (month.getDay() - weekStartsOn + 7) % 7
	return Array.from({ length: 42 }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - offset + 1))
}

const noopSubscribe = () => () => undefined

const useToday = (): Date | null => {
	const key = useSyncExternalStore(
		noopSubscribe,
		() => dayKey(new Date()),
		() => null,
	)
	if (key === null) return null
	const [year, month, date] = key.split('-').map(Number)
	return new Date(year ?? 0, month ?? 0, date ?? 1)
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

const useCalendar = (): CalendarContextValue => {
	const context = use(CalendarContext)
	if (!context) throw new Error('Calendar parts must be rendered inside Calendar.Provider or Calendar.Root')
	return context
}

type ProviderProps = CalendarContextValue & { children?: ReactNode }

const Provider = ({ state, actions, meta, children }: ProviderProps) => (
	<CalendarContext value={{ state, actions, meta }}>{children}</CalendarContext>
)

/** A fixed default keeps server and client output identical; pass `locale` to localize. */
const DEFAULT_LOCALE = 'en'

type RootProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (date: Date) => void
	defaultMonth?: Date
	locale?: string
	weekStartsOn?: Weekday
	children?: ReactNode
}

const Root = ({
	value,
	defaultValue = null,
	onValueChange,
	defaultMonth,
	locale = DEFAULT_LOCALE,
	weekStartsOn = 0,
	children,
}: RootProps) => {
	const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange)
	const [month, setMonth] = useState(() => startOfMonth(defaultMonth ?? selected ?? new Date()))
	const [view, setView] = useState<CalendarView>('days')
	const step = view === 'days' ? 1 : view === 'months' ? 12 : 12 * YEAR_PAGE_SIZE

	const actions: CalendarActions = {
		select: date => {
			setSelected(date)
			if (!isSameMonth(date, month)) setMonth(startOfMonth(date))
		},
		showMonth: next => setMonth(startOfMonth(next)),
		showView: setView,
		previous: () => setMonth(addMonths(month, -step)),
		next: () => setMonth(addMonths(month, step)),
	}

	return (
		<Provider state={{ selected, month, view }} actions={actions} meta={{ locale, weekStartsOn }}>
			{children}
		</Provider>
	)
}

const Frame = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='calendar' {...props} className={cn('flex w-full flex-col gap-3', className)} />
)

const Header = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div data-slot='calendar-header' {...props} className={cn('flex items-center gap-2', className)} />
)

const Heading = ({ className, onClick, ...props }: Omit<ComponentPropsWithRef<'button'>, 'children'>) => {
	const { state, actions, meta } = useCalendar()
	const start = yearPageStart(state.month)

	const label =
		state.view === 'days'
			? new Intl.DateTimeFormat(meta.locale, { month: 'long', year: 'numeric' }).format(state.month)
			: state.view === 'months'
				? String(state.month.getFullYear())
				: `${start} – ${start + YEAR_PAGE_SIZE - 1}`

	return (
		<button
			type='button'
			data-slot='calendar-heading'
			aria-live='polite'
			disabled={state.view === 'years'}
			{...props}
			onClick={event => {
				onClick?.(event)
				actions.showView(state.view === 'days' ? 'months' : 'years')
			}}
			className={cn(
				interactive,
				'mr-auto -ml-3 rounded-full px-3 py-1 font-journ-display text-2xl/none font-semibold uppercase disabled:opacity-100',
				className,
			)}
		>
			{label}
		</button>
	)
}

const Previous = ({ children, onClick, ...props }: IconButtonProps) => {
	const { actions } = useCalendar()
	return (
		<IconButton
			data-slot='calendar-previous'
			tone='ghost'
			size='sm'
			aria-label='Previous'
			{...props}
			onClick={event => {
				onClick?.(event)
				actions.previous()
			}}
		>
			{children ?? <ChevronLeft />}
		</IconButton>
	)
}

const Next = ({ children, onClick, ...props }: IconButtonProps) => {
	const { actions } = useCalendar()
	return (
		<IconButton
			data-slot='calendar-next'
			tone='ghost'
			size='sm'
			aria-label='Next'
			{...props}
			onClick={event => {
				onClick?.(event)
				actions.next()
			}}
		>
			{children ?? <ChevronRight />}
		</IconButton>
	)
}

const cell = tv({
	base: [interactive, 'w-full rounded-full text-base/6 tabular-nums data-[outside=true]:opacity-30 sm:text-sm/6'],
	variants: {
		shape: {
			day: 'aspect-square',
			period: 'h-11',
		},
		state: {
			idle: '',
			today: 'bg-current/10 font-semibold',
			selected: 'bg-journ-coral text-journ-ink font-semibold',
		},
	},
	defaultVariants: { shape: 'day', state: 'idle' },
})

const cellState = (selected: boolean, today: boolean) => (selected ? 'selected' : today ? 'today' : 'idle')

const Weekdays = ({ className, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'>) => {
	const { state, meta } = useCalendar()
	if (state.view !== 'days') return null
	const format = new Intl.DateTimeFormat(meta.locale, { weekday: 'short' })

	return (
		<div data-slot='calendar-weekdays' aria-hidden {...props} className={cn('grid grid-cols-7', className)}>
			{monthGrid(state.month, meta.weekStartsOn)
				.slice(0, 7)
				.map(date => (
					<span key={date.getDay()} className='py-1 text-center font-mono text-xs uppercase opacity-70'>
						{format.format(date)}
					</span>
				))}
		</div>
	)
}

const Days = ({ className, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'>) => {
	const { state, actions, meta } = useCalendar()
	const today = useToday()
	if (state.view !== 'days') return null
	const format = new Intl.DateTimeFormat(meta.locale, { dateStyle: 'full' })

	return (
		<div data-slot='calendar-days' {...props} className={cn('grid grid-cols-7 gap-y-1', className)}>
			{monthGrid(state.month, meta.weekStartsOn).map(date => (
				<button
					key={dayKey(date)}
					type='button'
					aria-label={format.format(date)}
					aria-pressed={isSameDay(date, state.selected)}
					aria-current={isSameDay(date, today) ? 'date' : undefined}
					data-outside={date.getMonth() !== state.month.getMonth()}
					onClick={() => actions.select(date)}
					className={cell({ state: cellState(isSameDay(date, state.selected), isSameDay(date, today)) })}
				>
					{date.getDate()}
				</button>
			))}
		</div>
	)
}

const Months = ({ className, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'>) => {
	const { state, actions, meta } = useCalendar()
	const today = useToday()
	if (state.view !== 'months') return null
	const format = new Intl.DateTimeFormat(meta.locale, { month: 'short' })
	const year = state.month.getFullYear()

	return (
		<div data-slot='calendar-months' {...props} className={cn('grid grid-cols-3 gap-2', className)}>
			{Array.from({ length: 12 }, (_, index) => new Date(year, index, 1)).map(date => (
				<button
					key={date.getMonth()}
					type='button'
					aria-pressed={isSameMonth(date, state.selected)}
					onClick={() => {
						actions.showMonth(date)
						actions.showView('days')
					}}
					className={cell({
						shape: 'period',
						state: cellState(isSameMonth(date, state.selected), isSameMonth(date, today)),
						class: 'capitalize',
					})}
				>
					{format.format(date)}
				</button>
			))}
		</div>
	)
}

const Years = ({ className, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'>) => {
	const { state, actions } = useCalendar()
	const today = useToday()
	if (state.view !== 'years') return null
	const start = yearPageStart(state.month)

	return (
		<div data-slot='calendar-years' {...props} className={cn('grid grid-cols-3 gap-2', className)}>
			{Array.from({ length: YEAR_PAGE_SIZE }, (_, index) => start + index).map(year => (
				<button
					key={year}
					type='button'
					aria-pressed={state.selected?.getFullYear() === year}
					onClick={() => {
						actions.showMonth(new Date(year, state.month.getMonth(), 1))
						actions.showView('months')
					}}
					className={cell({
						shape: 'period',
						state: cellState(state.selected?.getFullYear() === year, today?.getFullYear() === year),
					})}
				>
					{year}
				</button>
			))}
		</div>
	)
}

export { Provider, Root, Frame, Header, Heading, Previous, Next, Weekdays, Days, Months, Years, useCalendar }
export type { CalendarActions, CalendarContextValue, CalendarMeta, CalendarState, CalendarView, RootProps, Weekday }
