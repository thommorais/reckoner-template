'use client'

import { Button } from 'journ/button'
import { CommandPalette } from 'journ/command-palette'
import { DateRangePicker } from 'journ/date-range-picker'
import { MonthPicker } from 'journ/month-picker'
import { Toast } from 'journ/toast'
import { CalendarRange, FileText, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { MonthCalendar } from './month-calendar'

const DateRangeDemo = ({ locale }: { locale: string }) => (
	<DateRangePicker.Root locale={locale}>
		<DateRangePicker.Trigger className='w-full'>
			<CalendarRange />
			<DateRangePicker.Value placeholder='Pick a period' />
		</DateRangePicker.Trigger>
		<DateRangePicker.Content>
			<DateRangePicker.Title>Period</DateRangePicker.Title>
			<DateRangePicker.Description>Pick the first and last day.</DateRangePicker.Description>
			<DateRangePicker.Calendar weekStartsOn={1} defaultMonth={new Date(2026, 9, 1)}>
				<MonthCalendar />
			</DateRangePicker.Calendar>
		</DateRangePicker.Content>
	</DateRangePicker.Root>
)

const MonthPickerDemo = ({ locale }: { locale: string }) => {
	const [month, setMonth] = useState<Date | null>(null)

	return (
		<>
			<MonthPicker.Root locale={locale} defaultMonth={new Date(2026, 9, 1)} onValueChange={setMonth}>
				<MonthPicker.Frame>
					<MonthPicker.Header>
						<MonthPicker.Heading />
						<MonthPicker.Previous />
						<MonthPicker.Next />
					</MonthPicker.Header>
					<MonthPicker.Months />
					<MonthPicker.Years />
				</MonthPicker.Frame>
			</MonthPicker.Root>
			<p className='text-sm/5 opacity-70'>
				{month
					? `Picked ${new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month)}`
					: 'Pick a month.'}
			</p>
		</>
	)
}

const commands = [
	{ value: 'Open reports', group: 'Go to', icon: FileText },
	{ value: 'Open settings', group: 'Go to', icon: Settings },
	{ value: 'New schedule', group: 'Actions', icon: CalendarRange },
] as const

const PaletteDemo = () => (
	<CommandPalette.Root onSelect={value => Toast.show(value)}>
		<CommandPalette.Trigger asChild>
			<Button tone='field' className='w-full justify-start'>
				<Search />
				Search commands
				<kbd className='ml-auto font-mono text-xs opacity-60'>⌘K</kbd>
			</Button>
		</CommandPalette.Trigger>
		<CommandPalette.Content>
			<CommandPalette.Frame label='Commands'>
				<CommandPalette.Input placeholder='Type a command' />
				<CommandPalette.List>
					<CommandPalette.Empty>No command found</CommandPalette.Empty>
					{['Go to', 'Actions'].map(group => (
						<CommandPalette.Group key={group} heading={group}>
							{commands
								.filter(command => command.group === group)
								.map(({ value, icon: Icon }) => (
									<CommandPalette.Item key={value} value={value}>
										<Icon />
										{value}
									</CommandPalette.Item>
								))}
						</CommandPalette.Group>
					))}
				</CommandPalette.List>
			</CommandPalette.Frame>
		</CommandPalette.Content>
	</CommandPalette.Root>
)

export { DateRangeDemo, MonthPickerDemo, PaletteDemo }
