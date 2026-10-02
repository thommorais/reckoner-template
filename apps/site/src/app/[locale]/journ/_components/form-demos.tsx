'use client'

import { DateInput } from 'journ/date-input'
import { Field } from 'journ/field'
import { FileDropzone, type FileRejection } from 'journ/file-dropzone'
import { OtpInput } from 'journ/otp-input'
import { FileUp } from 'lucide-react'
import { useState } from 'react'

const DateInputDemo = ({ locale }: { locale: string }) => {
	const [date, setDate] = useState<Date | null>(null)

	return (
		<DateInput.Root locale={locale} onValueChange={setDate}>
			<Field.Root>
				<Field.Label>First run</Field.Label>
				<Field.Control>
					<DateInput.Field />
				</Field.Control>
				<Field.Description>
					{date
						? `Parsed: ${new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date)}`
						: 'Type a date and press Enter.'}
				</Field.Description>
			</Field.Root>
		</DateInput.Root>
	)
}

const OtpDemo = () => {
	const [code, setCode] = useState('')
	const [sent, setSent] = useState<string | null>(null)

	return (
		<div className='flex flex-col gap-3'>
			<OtpInput.Root validationType='numeric' autoSubmit onValueChange={setCode} onAutoSubmit={setSent}>
				{[0, 1, 2, 3, 4, 5].map(index => (
					<OtpInput.Slot key={index} aria-label={`Digit ${index + 1}`} className='size-11 flex-1' />
				))}
				<OtpInput.Hidden />
			</OtpInput.Root>
			<p className='text-sm/5 opacity-70'>{sent ? `Verified ${sent}` : `Code so far: ${code || 'none'}`}</p>
		</div>
	)
}

const DropzoneDemo = () => {
	const [files, setFiles] = useState<File[]>([])
	const [rejected, setRejected] = useState<FileRejection[]>([])

	return (
		<div className='flex flex-col gap-3'>
			<FileDropzone.Root
				aria-label='Upload statements'
				accept='image/*,.pdf'
				maxSize={2_000_000}
				onFilesAccepted={accepted => setFiles(current => [...current, ...accepted])}
				onFilesRejected={setRejected}
			>
				<FileDropzone.Icon>
					<FileUp />
				</FileDropzone.Icon>
				<FileDropzone.Title>Drop statements here</FileDropzone.Title>
				<FileDropzone.Description>Images or PDF, up to 2 MB each.</FileDropzone.Description>
			</FileDropzone.Root>
			{files.map(file => (
				<p key={file.name + file.size} className='text-sm/5'>
					{file.name}
				</p>
			))}
			{rejected.map(({ file, reason }) => (
				<p key={file.name + file.size} className='text-journ-coral text-sm/5'>
					{file.name}: {reason === 'type' ? 'wrong type' : reason === 'size' ? 'too large' : 'one file only'}
				</p>
			))}
		</div>
	)
}

export { DateInputDemo, DropzoneDemo, OtpDemo }
