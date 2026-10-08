'use client'

import { Container } from '_/components/ui/container'

const GlobalError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
	return (
		// global-error must include html and body tags
		<html lang='en'>
			<body className='bg-porcelain'>
				<Container asChild>
					<section className='h-dvh place-items-center'>
						<div className='w-full max-w-sm'>
							<header className='w-full'>
								<h2 className='text-danger-700 w-full grow text-center'>Something went wrong!</h2>
							</header>
							<footer className='justify-center'>
								<button type='button' color='info' onClick={() => reset()}>
									Try again
								</button>
							</footer>
						</div>
					</section>
				</Container>
			</body>
		</html>
	)
}

// oxlint-disable-next-line import/no-default-export -- page
export default GlobalError
