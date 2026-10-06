import { createRootRoute, Outlet } from '@tanstack/react-router'
import { DocumentLocale } from '_/components/document-locale'
import { ReloadPrompt } from '_/components/reload-prompt'
import { IntlayerProvider } from 'react-intlayer'
import { Toaster } from 'sonner'

const RootComponent = () => (
	<IntlayerProvider>
		<DocumentLocale />
		<Outlet />
		<Toaster position='top-center' />
		<ReloadPrompt />
	</IntlayerProvider>
)

const Route = createRootRoute({
	component: RootComponent,
})

export { Route }
