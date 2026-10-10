@extends ('layouts.app')

@section ('content')
	@php
	global $wp_query;
@endphp

	<section class="px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<div class="mb-16 max-w-3xl">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Journal</p>

				<h1
					class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl"
				>
					Blog
				</h1>

				<p class="mt-6 max-w-xl text-base leading-7 text-nova-text">Wiedza, inspiracje i doświadczenia z tworzenia nowoczesnych stron internetowych.</p>
			</div>

			<div class="mb-12 max-w-xl">
				<label for="nova-blog-search" class="mb-3 block text-sm font-medium text-nova-ink">
					Szukaj artykułów
				</label>

				<div class="relative">
					<input
						id="nova-blog-search"
						type="search"
						placeholder="Wpisz szukaną frazę..."
						autocomplete="off"
						class="w-full border border-nova-line bg-nova-white px-5 py-4 pr-12 text-sm text-nova-ink outline-none transition focus:border-nova-ink"
					/>

					<span
						class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-nova-muted"
						aria-hidden="true"
					>
						⌕
					</span>
				</div>

				<p
					id="nova-blog-search-status"
					class="mt-3 text-sm text-nova-muted"
					role="status"
					aria-live="polite"
				></p>
			</div>

			@if (have_posts())
				<div
					id="nova-blog-results"
					class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
				>
					@while (have_posts())
						@php (the_post())

						@include ('partials.post-card', [
							'postId' => get_the_ID(),
						])
					@endwhile
				</div>

				@if ($wp_query->max_num_pages > 1)
					<div id="nova-load-more-wrapper" class="mt-12 flex flex-col items-center gap-4">
						<button
							type="button"
							id="nova-load-more"
							data-page="{{ max(1, get_query_var('paged')) }}"
							data-max-pages="{{ $wp_query->max_num_pages }}"
							class="border border-nova-ink px-8 py-4 text-sm font-medium text-nova-ink transition hover:bg-nova-ink hover:text-nova-white disabled:cursor-wait disabled:opacity-50"
						>
							Załaduj więcej
						</button>

						<p
							id="nova-load-more-status"
							class="text-sm text-nova-muted"
							role="status"
							aria-live="polite"
						></p>
					</div>
				@endif

				<nav
					id="nova-blog-pagination"
					class="nova-pagination mt-16"
					aria-label="Paginacja bloga"
				>
					{!! paginate_links([
                    'mid_size' => 1,
                    'prev_text' => '← Poprzednia',
                    'next_text' => 'Następna →',
                    'type' => 'list',
                ]) !!}
				</nav>

			@else
				<p class="text-nova-muted">Brak wpisów do wyświetlenia.</p>
			@endif
		</div>
	</section>
@endsection
