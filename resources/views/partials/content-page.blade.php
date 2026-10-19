@php (the_content())

@if ($pagination())
	<nav class="page-nav" aria-label="Page">{!! $pagination !!}</nav>
@endif

@includeWhen (is_page('poprawki'), 'sections.latest-posts')
