'use client'

import { useRef, useState, type ComponentPropsWithRef, type DragEvent, type KeyboardEvent } from 'react'
import { cn } from './lib/cn'
import { mutedText } from './lib/text-styles'
import { iconTile } from './lib/icon-tile'

type RejectionReason = 'type' | 'size' | 'count'
type FileRejection = { file: File; reason: RejectionReason }

const matchesAccept = (file: File, accept: string | undefined): boolean => {
	if (!accept) return true
	return accept
		.split(',')
		.map(rule => rule.trim().toLowerCase())
		.filter(Boolean)
		.some(rule => {
			if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
			if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
			return file.type.toLowerCase() === rule
		})
}

/** Splits files into the ones that fit the rules and the ones that do not, with a reason each. */
const sortFiles = (
	files: File[],
	{ accept, maxSize, multiple }: { accept?: string; maxSize?: number; multiple: boolean },
): { accepted: File[]; rejected: FileRejection[] } => {
	const accepted: File[] = []
	const rejected: FileRejection[] = []

	for (const file of files) {
		if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type' })
		else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' })
		else if (!multiple && accepted.length === 1) rejected.push({ file, reason: 'count' })
		else accepted.push(file)
	}

	return { accepted, rejected }
}

type RootProps = Omit<ComponentPropsWithRef<'div'>, 'onDrop' | 'onChange'> & {
	/** Same syntax as the native input: `image/*,.pdf`. */
	accept?: string
	/** Largest allowed file in bytes. */
	maxSize?: number
	multiple?: boolean
	disabled?: boolean
	onFilesAccepted?: (files: File[]) => void
	onFilesRejected?: (rejections: FileRejection[]) => void
}

/** A drop target that is also a button: click or press Enter to open the file picker. */
const Root = ({
	accept,
	maxSize,
	multiple = true,
	disabled = false,
	onFilesAccepted,
	onFilesRejected,
	className,
	children,
	...props
}: RootProps) => {
	const input = useRef<HTMLInputElement>(null)
	const depth = useRef(0)
	const [dragging, setDragging] = useState(false)

	const receive = (files: File[]) => {
		if (disabled || files.length === 0) return
		const { accepted, rejected } = sortFiles(files, { accept, maxSize, multiple })
		if (accepted.length > 0) onFilesAccepted?.(accepted)
		if (rejected.length > 0) onFilesRejected?.(rejected)
	}

	const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (disabled) return
		depth.current += 1
		setDragging(true)
	}

	const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		depth.current = Math.max(0, depth.current - 1)
		if (depth.current === 0) setDragging(false)
	}

	const onDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		depth.current = 0
		setDragging(false)
		receive(Array.from(event.dataTransfer.files))
	}

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			input.current?.click()
		}
	}

	return (
		<div
			data-slot='file-dropzone'
			data-dragging={dragging || undefined}
			data-disabled={disabled || undefined}
			role='button'
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			{...props}
			onClick={() => !disabled && input.current?.click()}
			onKeyDown={onKeyDown}
			onDragEnter={onDragEnter}
			onDragOver={event => event.preventDefault()}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			className={cn(
				'flex cursor-default flex-col items-center gap-2 rounded-journ border-2 border-dashed border-current/25 p-8 text-center outline-none transition-colors',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-journ-sky',
				'data-[dragging]:border-journ-sky data-[dragging]:bg-journ-sky/15 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className,
			)}
		>
			<input
				ref={input}
				type='file'
				tabIndex={-1}
				hidden
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				onClick={event => event.stopPropagation()}
				onChange={event => {
					receive(Array.from(event.target.files ?? []))
					event.target.value = ''
				}}
			/>
			{children}
		</div>
	)
}

const Icon = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
	<span
		data-slot='file-dropzone-icon'
		aria-hidden
		{...props}
		className={iconTile({ size: 'md', tone: 'soft', class: className })}
	/>
)

const Title = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='file-dropzone-title' {...props} className={cn('text-sm/6 font-medium', className)} />
)

const Description = ({ className, ...props }: ComponentPropsWithRef<'p'>) => (
	<p data-slot='file-dropzone-description' {...props} className={cn(mutedText, className)} />
)

export { Root, Icon, Title, Description, matchesAccept, sortFiles }
export type { FileRejection, RejectionReason }
