'use client'

import { AnimatedSize } from 'journ/animated-size'
import { Button } from 'journ/button'
import { TextMorph } from 'journ/text-morph'
import { useState } from 'react'

const lines = ['Syncing your POS', 'Reading payroll', 'Matching invoices', 'All caught up']

const AnimatedSizeDemo = () => {
	const [open, setOpen] = useState(false)

	return (
		<div className='flex flex-col gap-3'>
			<Button tone='outline' className='self-start' onClick={() => setOpen(current => !current)}>
				{open ? 'Show less' : 'Show more'}
			</Button>
			<AnimatedSize className='rounded-2xl bg-current/10'>
				<div className='flex flex-col gap-2 p-4 text-sm/5'>
					<p>Labor is 28% of revenue this week.</p>
					{open && (
						<>
							<p>That is 3 points above your target and the highest in six weeks.</p>
							<p>Two shifts on Friday account for most of the overage.</p>
						</>
					)}
				</div>
			</AnimatedSize>
		</div>
	)
}

const TextMorphDemo = () => {
	const [index, setIndex] = useState(0)

	return (
		<div className='flex flex-col gap-3'>
			<TextMorph className='font-journ-display text-3xl/none font-semibold uppercase'>{lines[index] ?? ''}</TextMorph>
			<Button tone='outline' className='self-start' onClick={() => setIndex(current => (current + 1) % lines.length)}>
				Next status
			</Button>
		</div>
	)
}

export { AnimatedSizeDemo, TextMorphDemo }
