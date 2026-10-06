import { createRootRoute, Outlet } from '@tanstack/react-router'
import { DocumentLocale } from '_/components/document-locale'
import { ReloadPrompt } from '_/components/reload-prompt'
import { Toast } from 'journ/toast'
import { IntlayerProvider } from 'react-intlayer'

const RootComponent = () => (
	<IntlayerProvider>
		<DocumentLocale />
		<Outlet />
		<Toast.Provider />
		<ReloadPrompt />
	</IntlayerProvider>
)

const Route = createRootRoute({
	component: RootComponent,
})

export { Route }
