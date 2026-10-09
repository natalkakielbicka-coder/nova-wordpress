@if (function_exists('yoast_breadcrumb'))
	<nav
		class="nova-breadcrumbs border-b border-nova-line px-6 py-4"
		aria-label="Ścieżka nawigacji"
	>
		<div class="mx-auto max-w-7xl">{!! yoast_breadcrumb('', '', false) !!}</div>
	</nav>
@endif
