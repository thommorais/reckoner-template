import { IconButton } from 'journ/icon-button'
import { Page } from 'journ/page'
import { PageHeader } from 'journ/page-header'
import { ArrowLeft } from 'lucide-react'
import { BottomNav } from '../_components/bottom-nav'
import { PickerDemo } from '../_components/picker-demo'

const SchedulePage = (): React.ReactNode => (
	<Page.Root tone='indigo'>
		<Page.Content>
			<PageHeader.Root>
				<IconButton tone='ghost' aria-label='Back'>
					<ArrowLeft />
				</IconButton>
				<PageHeader.Title>Schedule</PageHeader.Title>
			</PageHeader.Root>

			<PickerDemo />

			<BottomNav current='/journ/schedule' />
		</Page.Content>
	</Page.Root>
)

// oxlint-disable-next-line import/no-default-export -- page
export default SchedulePage
