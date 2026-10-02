import type { ComponentPropsWithRef } from 'react'
import { cn } from './lib/cn'

const Root = ({ className, ...props }: ComponentPropsWithRef<'table'>) => (
	<div data-slot='table-container' className='w-full overflow-x-auto'>
		<table data-slot='table' {...props} className={cn('w-full border-collapse text-left text-sm/6', className)} />
	</div>
)

const Caption = ({ className, ...props }: ComponentPropsWithRef<'caption'>) => (
	<caption data-slot='table-caption' {...props} className={cn('pb-3 text-left text-sm/5 opacity-70', className)} />
)

const Head = (props: ComponentPropsWithRef<'thead'>) => <thead data-slot='table-head' {...props} />

const Body = ({ className, ...props }: ComponentPropsWithRef<'tbody'>) => (
	<tbody data-slot='table-body' {...props} className={cn('[&>tr:last-child]:border-b-0', className)} />
)

const Row = ({ className, ...props }: ComponentPropsWithRef<'tr'>) => (
	<tr data-slot='table-row' {...props} className={cn('border-b border-current/10 hover:bg-current/5', className)} />
)

const Header = ({ className, ...props }: ComponentPropsWithRef<'th'>) => (
	<th
		data-slot='table-header'
		{...props}
		className={cn('border-b border-current/15 px-3 py-2 font-mono text-xs font-normal uppercase opacity-60', className)}
	/>
)

const Cell = ({ className, ...props }: ComponentPropsWithRef<'td'>) => (
	<td data-slot='table-cell' {...props} className={cn('px-3 py-3 tabular-nums', className)} />
)

const Table = { Root, Caption, Head, Body, Row, Header, Cell }

export { Table }
