import type { LucideIcon } from 'lucide-react'
import { IconButton, type IconButtonProps } from './icon-button'

type StepButtonProps = Omit<IconButtonProps, 'onClick'> & {
	icon: LucideIcon
	/** Runs after the caller's own `onClick`. */
	onStep: () => void
	onClick?: IconButtonProps['onClick']
}

/** The small ghost icon button behind every previous, next, minus and plus control. */
const StepButton = ({ icon: Icon, onStep, onClick, children, ...props }: StepButtonProps) => (
	<IconButton
		tone='ghost'
		size='sm'
		{...props}
		onClick={event => {
			onClick?.(event)
			onStep()
		}}
	>
		{children ?? <Icon />}
	</IconButton>
)

export { StepButton }
export type { StepButtonProps }
