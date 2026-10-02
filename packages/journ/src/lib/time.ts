const toMinutes = (time: string): number | null => {
	const match = /^(\d{1,2}):(\d{2})$/.exec(time)
	if (!match) return null
	const hours = Number(match[1])
	const minutes = Number(match[2])
	return hours < 24 && minutes < 60 ? hours * 60 + minutes : null
}

/** Minutes from `start` to `stop` ("HH:mm"). A stop before the start means the next day. */
const minutesBetween = (start: string, stop: string): number | null => {
	const from = toMinutes(start)
	const to = toMinutes(stop)
	if (from === null || to === null) return null
	return to >= from ? to - from : to + 24 * 60 - from
}

/** 150 becomes "2h 30m", 45 becomes "45m", 120 becomes "2h". */
const formatDuration = (minutes: number): string => {
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	if (hours === 0) return `${rest}m`
	return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

export { formatDuration, minutesBetween }
