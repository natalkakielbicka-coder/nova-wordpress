<!doctype html>
<html @php (language_attributes())>
<head>
	<script>
		(() => {
			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				document.documentElement.classList.add('nova-motion-ready');
			}

			try {
				const saved = localStorage.getItem('nova-theme');

				const theme =
					saved === 'dark' || saved === 'light'
						? saved
						: window.matchMedia('(prefers-color-scheme: dark)').matches
							? 'dark'
							: 'light';

				document.documentElement.dataset.theme = theme;
			} catch {
				document.documentElement.dataset.theme = 'light';
			}
		})();
	</script>

	<noscript>
		<style>
			html.nova-motion-ready .nova-project-card {
				opacity: 1 !important;
				transform: none !important;
				visibility: visible !important;
			}
		</style>
	</noscript>

	<script>
		(() => {
			window.setTimeout(() => {
				if (
					document.documentElement.classList.contains('nova-motion-ready') &&
					!window.novaProjectAnimationsReady
				) {
					document.documentElement.classList.remove('nova-motion-ready');
				}
			}, 5000);
		})();
	</script>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	@php (do_action('get_header'))
	@php (wp_head())

	@vite (['resources/css/app.css', 'resources/js/app.js'])
</head>

<body @php (body_class())>
	@php (wp_body_open())

	<div id="app">
		<a class="sr-only focus:not-sr-only" href="#main"> {{ __('Skip to content', 'sage') }} </a>

		@include ('sections.header')

		@if (!is_front_page())
			@include ('partials.breadcrumbs')
		@endif

		<main id="main" class="main">
			@yield ('content')
		</main>

		@hasSection ('sidebar')
			<aside class="sidebar">
				@yield ('sidebar')
			</aside>
		@endif

		@include ('sections.footer')
	</div>

	@php (do_action('get_footer'))
	@php (wp_footer())
</body>
</html>
