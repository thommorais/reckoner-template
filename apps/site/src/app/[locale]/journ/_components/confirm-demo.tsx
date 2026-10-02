'use client'

import { AlertDialog } from 'journ/alert-dialog'
import { Button } from 'journ/button'
import { Spinner } from 'journ/spinner'
import { Toast } from 'journ/toast'
import { useState } from 'react'

const ConfirmDemo = () => {
	const [open, setOpen] = useState(false)
	const [pending, setPending] = useState(false)

	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger asChild>
				<Button tone='coral' className='self-start'>
					Delete report
				</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title>Delete report?</AlertDialog.Title>
				<AlertDialog.Description>
					Prime cost report and its history will be removed. This cannot be undone.
				</AlertDialog.Description>
				<AlertDialog.Actions>
					<AlertDialog.Cancel asChild>
						<Button tone='ghost' disabled={pending}>
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<Button
							tone='coral'
							disabled={pending}
							onClick={event => {
								event.preventDefault()
								setPending(true)
								setTimeout(() => {
									setPending(false)
									setOpen(false)
									Toast.show('Report deleted')
								}, 900)
							}}
						>
							{pending && <Spinner />}
							Delete
						</Button>
					</AlertDialog.Action>
				</AlertDialog.Actions>
			</AlertDialog.Content>
		</AlertDialog.Root>
	)
}

export { ConfirmDemo }
