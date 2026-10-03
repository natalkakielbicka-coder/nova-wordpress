@extends ('layouts.app')

@section ('content')
	<section class="px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<div class="mb-16 max-w-3xl">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Portfolio</p>

				<h1
					class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl"
				>
					Projekty
				</h1>

				<p class="mt-6 max-w-xl text-base leading-7 text-nova-text">Wybrane realizacje stron internetowych i sklepów opartych na WordPressie.</p>
			</div>

			@if (have_posts())
				<div class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
					@while (have_posts())
						@php (the_post())

						<x-project-card />
					@endwhile
				</div>
			@else
				<p class="text-nova-muted">Brak projektów do wyświetlenia.</p>
			@endif
		</div>
	</section>
@endsection
