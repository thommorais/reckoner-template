import type { ComponentProps } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { cn } from './lib/cn'
import { displayTitle } from './lib/text-styles'

const components: Components = {
	h1: ({ className, ...props }) => (
		<h1 {...props} className={cn(displayTitle, 'mt-6 mb-2 text-4xl/[0.95]', className)} />
	),
	h2: ({ className, ...props }) => <h2 {...props} className={cn(displayTitle, 'mt-5 mb-2', className)} />,
	h3: ({ className, ...props }) => (
		<h3 {...props} className={cn('font-journ-display mt-4 mb-1 text-xl/none font-semibold uppercase', className)} />
	),
	p: ({ className, ...props }) => <p {...props} className={cn('my-3 text-sm/6 text-pretty', className)} />,
	a: ({ className, ...props }) => (
		<a
			{...props}
			className={cn(
				'rounded-sm underline decoration-current/40 underline-offset-4 outline-none hover:decoration-current focus-visible:outline-2 focus-visible:outline-journ-sky',
				className,
			)}
		/>
	),
	ul: ({ className, ...props }) => (
		<ul {...props} className={cn('my-3 list-disc pl-5 text-sm/6 marker:opacity-50', className)} />
	),
	ol: ({ className, ...props }) => (
		<ol {...props} className={cn('my-3 list-decimal pl-5 text-sm/6 marker:opacity-50', className)} />
	),
	li: ({ className, ...props }) => <li {...props} className={cn('my-1', className)} />,
	blockquote: ({ className, ...props }) => (
		<blockquote {...props} className={cn('my-3 border-l-2 border-current/30 pl-4 text-sm/6 opacity-80', className)} />
	),
	hr: ({ className, ...props }) => (
		<hr {...props} className={cn('my-6 border-0 border-t border-current/15', className)} />
	),
	code: ({ className, ...props }) => (
		<code {...props} className={cn('rounded-md bg-current/10 px-1 py-0.5 font-mono text-xs', className)} />
	),
	pre: ({ className, ...props }) => (
		<pre
			{...props}
			className={cn(
				'scrollbar-journ my-3 overflow-x-auto rounded-2xl bg-current/10 p-4 font-mono text-xs/5 [&_code]:bg-transparent [&_code]:p-0',
				className,
			)}
		/>
	),
	strong: ({ className, ...props }) => <strong {...props} className={cn('font-semibold', className)} />,
}

type MarkdownProps = Omit<ComponentProps<typeof ReactMarkdown>, 'components'> & {
	/** Override or add elements. Merged over the journ defaults. */
	components?: Components
	/** Applied to the wrapper, which keeps the element margins from stacking with a parent's gap. */
	className?: string
}

const Markdown = ({ components: overrides, className, ...props }: MarkdownProps) => (
	<div data-slot='markdown' className={cn('[&>:first-child]:mt-0 [&>:last-child]:mb-0', className)}>
		<ReactMarkdown {...props} components={{ ...components, ...overrides }} />
	</div>
)

export { Markdown }
export type { MarkdownProps }
