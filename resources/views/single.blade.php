@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php (the_post())

		@if (is_singular('post'))
			<div
				id="nova-reading-progress"
				class="fixed left-0 top-0 z-[9999] h-[4px] w-full origin-left scale-x-0"
				style="background-color: var(--color-nova-ink, #171714)"
				role="progressbar"
				aria-label="Postęp czytania artykułu"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow="0"
			></div>
		@endif

		@includeFirst ([
            'partials.content-single-' . get_post_type(),
            'partials.content-single'
        ])
	@endwhile
@endsection
