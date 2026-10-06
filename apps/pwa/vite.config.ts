import tailwindcss from '@tailwindcss/vite'
import tanstackRouter from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { intlayer } from 'vite-intlayer'
import { VitePWA } from 'vite-plugin-pwa'

const THEME_COLOR = '#DE1A1A'

// oxlint-disable-next-line import/no-default-export -- vite config
export default defineConfig({
	server: {
		host: true,
	},
	build: {
		sourcemap: true,
		rolldownOptions: {
			output: {
				// The framework core stays in its own chunk so it survives app
				// deploys in the cache.
				codeSplitting: {
					groups: [
						{
							name: 'react-vendor',
							test: /[\\/]node_modules[\\/](react|react-dom|scheduler|@tanstack[\\/]react-router)[\\/]/,
						},
					],
				},
			},
		},
	},
	plugins: [
		tanstackRouter({
			routesDirectory: './src/routes',
			generatedRouteTree: './src/routeTree.gen.ts',
			autoCodeSplitting: true,
			target: 'react',
		}),
		react(),
		tailwindcss(),
		intlayer(),
		VitePWA({
			registerType: 'prompt',
			// vite-plugin-pwa 1.3.0 cannot locate its virtual register module
			// under Vite 8, so the app registers the worker in register-sw.ts.
			injectRegister: null,
			includeAssets: ['favicon.svg', 'icons/favicon.ico', 'icons/apple-touch-icon-180x180.png'],
			manifest: {
				id: '/',
				name: 'thom',
				short_name: 'thom',
				description: 'thom template.',
				lang: 'pt',
				dir: 'ltr',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
				orientation: 'portrait-primary',
				background_color: THEME_COLOR,
				theme_color: THEME_COLOR,
				icons: [
					{ src: '/icons/pwa-64x64.png', sizes: '64x64', type: 'image/png', purpose: 'any' },
					{ src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
					{ src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
					{ src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
				screenshots: [
					{
						src: '/screenshots/wide-1280x800.png',
						sizes: '1280x800',
						type: 'image/png',
						form_factor: 'wide',
						label: 'thom',
					},
					{
						src: '/screenshots/narrow-720x1280.png',
						sizes: '720x1280',
						type: 'image/png',
						form_factor: 'narrow',
						label: 'thom',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
				// The SPA falls back to index.html, which would answer a missing API
				// route with the app shell instead of a 404.
				navigateFallbackDenylist: [/^\/api/, /^\/_/],
				cleanupOutdatedCaches: true,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts',
							expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
							cacheableResponse: { statuses: [0, 200] },
						},
					},
				],
			},
			devOptions: { enabled: false },
		}),
	],
	resolve: {
		alias: {
			_: resolve(import.meta.dirname, './src'),
		},
	},
})
