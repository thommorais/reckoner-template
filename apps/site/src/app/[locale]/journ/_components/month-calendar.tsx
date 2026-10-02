import { Calendar } from 'journ/calendar'

const MonthCalendar = () => (
	<Calendar.Frame>
		<Calendar.Header>
			<Calendar.Heading />
			<Calendar.Previous />
			<Calendar.Next />
		</Calendar.Header>
		<Calendar.Weekdays />
		<Calendar.Days />
		<Calendar.Months />
		<Calendar.Years />
	</Calendar.Frame>
)

export { MonthCalendar }
