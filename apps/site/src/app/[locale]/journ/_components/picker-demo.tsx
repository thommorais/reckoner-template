'use client'

import { Calendar } from 'journ/calendar'
import { Card } from 'journ/card'
import { Combobox } from 'journ/combobox'
import { DatePicker } from 'journ/date-picker'
import { CalendarDays, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { MonthCalendar } from './month-calendar'

const reports = [
	{ id: 'prime-cost', name: 'Prime cost report', group: 'Finance' },
	{ id: 'p-and-l', name: 'P&L statement', group: 'Finance' },
	{ id: 'menu-mix', name: 'Menu mix', group: 'Menu' },
	{ id: 'menu-engineering', name: 'Menu engineering', group: 'Menu' },
	{ id: 'labor', name: 'Labor cost', group: 'Operations' },
	{ id: 'inventory', name: 'Inventory risk', group: 'Operations' },
	{ id: 'cafe', name: 'Café sales', group: 'Operations' },
] as const

const groups = [...new Set(reports.map(report => report.group))]

const PickerDemo = ({ locale }: { locale: string }) => {
	const [reportId, setReportId] = useState<string | null>(null)
	const report = reports.find(candidate => candidate.id === reportId)

	return (
		<>
			<Card.Root>
				<Card.Title>New schedule</Card.Title>
				<Card.Content className='gap-3'>
					<Combobox.Root value={reportId} onValueChange={setReportId}>
						<Combobox.Trigger className='w-full'>
							<Combobox.Value placeholder='Pick a report'>{report?.name}</Combobox.Value>
							<ChevronsUpDown className='ml-auto' />
						</Combobox.Trigger>
						<Combobox.Content>
							<Combobox.Title>Report</Combobox.Title>
							<Combobox.Frame label='Reports'>
								<Combobox.Input placeholder='Search reports' />
								<Combobox.List>
									<Combobox.Empty>No report found</Combobox.Empty>
									{groups.map(group => (
										<Combobox.Group key={group} heading={group}>
											{reports
												.filter(candidate => candidate.group === group)
												.map(candidate => (
													<Combobox.Item key={candidate.id} value={candidate.id} keywords={[candidate.name]}>
														{candidate.name}
														<Combobox.ItemIndicator />
													</Combobox.Item>
												))}
										</Combobox.Group>
									))}
								</Combobox.List>
							</Combobox.Frame>
						</Combobox.Content>
					</Combobox.Root>

					<DatePicker.Root locale={locale}>
						<DatePicker.Trigger className='w-full'>
							<CalendarDays />
							<DatePicker.Value placeholder='First run' />
						</DatePicker.Trigger>
						<DatePicker.Content>
							<DatePicker.Title>First run</DatePicker.Title>
							<DatePicker.Calendar weekStartsOn={1}>
								<MonthCalendar />
							</DatePicker.Calendar>
						</DatePicker.Content>
					</DatePicker.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root tone='yellow'>
				<Calendar.Root weekStartsOn={1} locale={locale}>
					<MonthCalendar />
				</Calendar.Root>
			</Card.Root>
		</>
	)
}

export { PickerDemo }
