import { solidTones } from './tones'
import { tv } from './tv'

/** A rounded square that holds an icon: card icons, empty states, dropzones. */
const iconTile = tv({
	base: 'grid shrink-0 place-items-center',
	variants: {
		size: {
			md: 'size-11 rounded-2xl [&>svg]:size-5',
			lg: 'size-14 rounded-3xl [&>svg]:size-6',
		},
		tone: {
			yellow: solidTones.yellow,
			soft: 'bg-current/10',
		},
	},
	defaultVariants: { size: 'md', tone: 'yellow' },
})

export { iconTile }
