/** Grows the hit area to at least 44x44px on touch devices without changing layout. */
const TouchTarget = ({ children }: { children?: React.ReactNode }) => (
	<>
		<span
			aria-hidden
			data-slot='touch-target'
			className='absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden'
		/>
		{children}
	</>
)

export { TouchTarget }
