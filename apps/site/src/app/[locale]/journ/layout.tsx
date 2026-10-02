import { Toast } from 'journ/toast'
import { Barlow_Condensed } from 'next/font/google'

const barlowCondensed = Barlow_Condensed({
	subsets: ['latin'],
	weight: ['500', '600'],
	display: 'swap',
	variable: '--font-journ-display',
})

const JournLayout = ({ children }: { children: React.ReactNode }): React.ReactNode => (
	<div className={barlowCondensed.variable}>
		{children}
		<Toast.Provider />
	</div>
)

// oxlint-disable-next-line import/no-default-export -- layout
export default JournLayout
