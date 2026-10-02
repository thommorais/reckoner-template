'use client'

import { Button } from 'journ/button'
import { Toast } from 'journ/toast'

const ToastDemo = () => (
	<Button
		className='self-start'
		onClick={() =>
			Toast.show('Report saved', {
				description: 'Prime cost report was added to your list.',
				action: { label: 'Undo', onClick: () => undefined },
			})
		}
	>
		Show toast
	</Button>
)

export { ToastDemo }
