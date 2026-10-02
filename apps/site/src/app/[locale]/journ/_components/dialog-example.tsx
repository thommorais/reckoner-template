'use client'

import { Button } from 'journ/button'
import { Composer } from 'journ/composer'
import { Dialog } from 'journ/dialog'
import { Field } from 'journ/field'
import { Toast } from 'journ/toast'
import { useState } from 'react'

const DialogExample = () => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const invalid = name.trim().length === 0

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<Button className='self-start'>Rename report</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Rename report</Dialog.Title>
				<Dialog.Description>Pick a name your team will recognize.</Dialog.Description>
				<Dialog.Body>
					<Field.Root invalid={invalid}>
						<Field.Label>Name</Field.Label>
						<Field.Control>
							<Composer.Root>
								<Composer.Input
									value={name}
									onChange={event => setName(event.target.value)}
									placeholder='Prime cost report'
								/>
							</Composer.Root>
						</Field.Control>
						<Field.Description>Shown in the reports list.</Field.Description>
						<Field.Error>A name is required.</Field.Error>
					</Field.Root>
				</Dialog.Body>
				<Dialog.Actions>
					<Dialog.Close asChild>
						<Button tone='ghost'>Cancel</Button>
					</Dialog.Close>
					<Button
						tone='coral'
						disabled={invalid}
						onClick={() => {
							Toast.show(`Renamed to ${name}`)
							setOpen(false)
						}}
					>
						Save
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog.Root>
	)
}

export { DialogExample }
