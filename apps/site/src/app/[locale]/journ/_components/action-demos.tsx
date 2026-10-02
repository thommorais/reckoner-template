'use client'

import { Button } from 'journ/button'
import { QuantityInput } from 'journ/quantity-input'
import { Toast } from 'journ/toast'
import { useState } from 'react'

const PendingButtonDemo = () => {
	const [pending, setPending] = useState(false)

	return (
		<Button
			tone='coral'
			pending={pending}
			className='self-start'
			onClick={() => {
				setPending(true)
				setTimeout(() => {
					setPending(false)
					Toast.show('Report saved')
				}, 1200)
			}}
		>
			{pending ? 'Saving' : 'Save report'}
		</Button>
	)
}

const QuantityDemo = () => {
	const [seats, setSeats] = useState(4)

	return (
		<div className='flex flex-col gap-2'>
			<QuantityInput.Root value={seats} onValueChange={setSeats} min={1} max={20} className='self-start'>
				<QuantityInput.Decrement />
				<QuantityInput.Field aria-label='Seats' className='w-14' />
				<QuantityInput.Increment />
			</QuantityInput.Root>
			<p className='text-sm/5 opacity-70'>{seats} seats, between 1 and 20.</p>
		</div>
	)
}

export { PendingButtonDemo, QuantityDemo }
