@if (function_exists('yoast_breadcrumb'))
	@php
        $breadcrumbs = yoast_breadcrumb('', '', false);
    @endphp

	@if ($breadcrumbs)
		<nav
			class="nova-breadcrumbs border-b border-nova-line px-4 py-4 sm:px-6"
			aria-label="Ścieżka nawigacji"
		>
			<div class="mx-auto max-w-7xl">{!! $breadcrumbs !!}</div>
		</nav>
	@endif
@endif
