import { Barlow_Condensed } from 'next/font/google'

const barlowCondensed = Barlow_Condensed({
	subsets: ['latin'],
	weight: ['500', '600'],
	display: 'swap',
	variable: '--font-journ-display',
})

const JournLayout = ({ children }: { children: React.ReactNode }): React.ReactNode => (
	<div className={`${barlowCondensed.variable} bg-journ-ink text-journ-paper min-h-dvh`}>
		<main className='mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-8'>{children}</main>
	</div>
)

// oxlint-disable-next-line import/no-default-export -- layout
export default JournLayout
