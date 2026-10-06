import { createFileRoute } from '@tanstack/react-router'
import { Logo } from '_/components/logo'

const Home = () => (
	<main className='relative flex min-h-dvh w-full flex-col items-center justify-center'>
		<Logo className='h-16 w-auto' />
	</main>
)

const Route = createFileRoute('/')({
	component: Home,
})

export { Route }
