import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FileDropzone } from './file-dropzone'
import { matchesAccept, sortFiles } from './file-dropzone-parts'

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type })

const renderDropzone = (props: React.ComponentProps<typeof FileDropzone.Root> = {}) =>
	render(
		<FileDropzone.Root aria-label='Upload' {...props}>
			<FileDropzone.Title>Drop files</FileDropzone.Title>
		</FileDropzone.Root>,
	)

const drop = (files: File[]) =>
	fireEvent.drop(screen.getByRole('button', { name: 'Upload' }), { dataTransfer: { files } })

describe('matchesAccept', () => {
	it('matches extensions, mime types and wildcards', () => {
		expect(matchesAccept(file('a.pdf', 'application/pdf'), '.pdf')).toBe(true)
		expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true)
		expect(matchesAccept(file('a.png', 'image/png'), 'application/pdf, .csv')).toBe(false)
		expect(matchesAccept(file('a.anything', ''), undefined)).toBe(true)
	})
})

describe('sortFiles', () => {
	it('keeps only one file when multiple is off', () => {
		const result = sortFiles([file('a.png', 'image/png'), file('b.png', 'image/png')], { multiple: false })

		expect(result.accepted).toHaveLength(1)
		expect(result.rejected.map(item => item.reason)).toEqual(['count'])
	})
})

describe('FileDropzone', () => {
	it('accepts dropped files', () => {
		const onFilesAccepted = vi.fn()
		renderDropzone({ onFilesAccepted })
		const photo = file('a.png', 'image/png')

		drop([photo])

		expect(onFilesAccepted).toHaveBeenCalledWith([photo])
	})

	it('rejects the wrong type and files that are too large, with a reason', () => {
		const onFilesAccepted = vi.fn()
		const onFilesRejected = vi.fn()
		renderDropzone({ accept: 'image/*', maxSize: 100, onFilesAccepted, onFilesRejected })
		const pdf = file('a.pdf', 'application/pdf')
		const big = file('big.png', 'image/png', 500)
		const ok = file('ok.png', 'image/png', 50)

		drop([pdf, big, ok])

		expect(onFilesAccepted).toHaveBeenCalledWith([ok])
		expect(onFilesRejected).toHaveBeenCalledWith([
			{ file: pdf, reason: 'type' },
			{ file: big, reason: 'size' },
		])
	})

	it('shows the dragging state while a file is over it', () => {
		renderDropzone()
		const zone = screen.getByRole('button', { name: 'Upload' })

		fireEvent.dragEnter(zone)
		expect(zone.getAttribute('data-dragging')).toBe('true')

		fireEvent.dragLeave(zone)
		expect(zone.getAttribute('data-dragging')).toBeNull()
	})

	it('picks files from the input', () => {
		const onFilesAccepted = vi.fn()
		renderDropzone({ onFilesAccepted })
		const input = document.querySelector('input[type=file]') as HTMLInputElement
		const photo = file('a.png', 'image/png')

		fireEvent.change(input, { target: { files: [photo] } })

		expect(onFilesAccepted).toHaveBeenCalledWith([photo])
	})

	it('ignores everything when disabled', () => {
		const onFilesAccepted = vi.fn()
		renderDropzone({ disabled: true, onFilesAccepted })
		const zone = screen.getByRole('button', { name: 'Upload' })

		drop([file('a.png', 'image/png')])
		fireEvent.dragEnter(zone)

		expect(onFilesAccepted).not.toHaveBeenCalled()
		expect(zone.getAttribute('data-dragging')).toBeNull()
		expect(zone.getAttribute('aria-disabled')).toBe('true')
	})
})
