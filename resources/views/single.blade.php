@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php (the_post())

		@if (is_singular('post'))
			<div
				id="nova-reading-progress"
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
