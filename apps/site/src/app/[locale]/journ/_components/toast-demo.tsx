'use client'

import { Toast } from 'journ/toast'

const ToastDemo = () => (
	<button
		type='button'
		className='bg-journ-paper text-journ-ink self-start rounded-full px-4 py-2 text-sm'
		onClick={() =>
			Toast.show('Report saved', {
				description: 'Prime cost report was added to your list.',
				action: { label: 'Undo', onClick: () => undefined },
			})
		}
	>
		Show toast
	</button>
)

export { ToastDemo }
