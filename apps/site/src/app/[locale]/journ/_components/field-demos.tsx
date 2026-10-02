'use client'

import { CurrencyInput } from 'journ/currency-input'
import { TagInput } from 'journ/tag-input'
import { TimeRange } from 'journ/time-range'
import { useState } from 'react'

const CurrencyDemo = ({ locale }: { locale: string }) => {
	const [amount, setAmount] = useState<number | null>(1234.5)

	return (
		<div className='flex flex-col gap-2'>
			<CurrencyInput.Root
				locale={locale}
				currency={locale === 'pt' ? 'BRL' : 'USD'}
				value={amount}
				onValueChange={setAmount}
				min={0}
			>
				<CurrencyInput.Field aria-label='Amount' />
			</CurrencyInput.Root>
			<p className='text-sm/5 opacity-70'>{amount === null ? 'Empty' : `Stored as ${amount}`}</p>
		</div>
	)
}

const TimeRangeDemo = () => (
	<TimeRange.Root defaultValue={{ start: '09:00', stop: '17:30' }}>
		<div className='flex items-center gap-2'>
			<TimeRange.Start aria-label='Start' />
			<TimeRange.Stop aria-label='Stop' />
		</div>
		<p className='text-sm/5'>
			Worked <TimeRange.Duration aria-label='Duration' className='font-medium opacity-100' />
		</p>
	</TimeRange.Root>
)

const isEmail = (tag: string) => /^\S+@\S+\.\S+$/.test(tag)

const TagDemo = () => (
	<div className='flex flex-col gap-2'>
		<TagInput.Root defaultValue={['hanna@thedailygrind.com']} validate={isEmail}>
			<TagInput.Tags />
			<TagInput.Field aria-label='Recipients' placeholder='Add an email' />
		</TagInput.Root>
		<p className='text-sm/5 opacity-70'>Enter or comma adds. Backspace removes the last. Paste a list.</p>
	</div>
)

export { CurrencyDemo, TagDemo, TimeRangeDemo }
