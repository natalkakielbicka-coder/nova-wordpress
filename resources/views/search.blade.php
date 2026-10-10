@extends ('layouts.app')

@section ('content')
	@php
        global $wp_query;

        $searchQuery = get_search_query();
        $foundPosts = (int) $wp_query->found_posts;
    @endphp

	<section class="px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<div class="mb-16 max-w-3xl">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Search</p>

				<h1
					class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl"
				>
					Wyniki wyszukiwania
				</h1>

				<p class="mt-6 text-base leading-7 text-nova-text">
					Szukana fraza:
					<strong class="font-medium text-nova-ink"> {{ $searchQuery }} </strong>
				</p>

				<p class="mt-2 text-sm text-nova-muted">Znaleziono: {{ $foundPosts }} artykułów</p>
			</div>

			<form role="search" method="get" action="{{ home_url('/') }}" class="mb-14 max-w-xl">
				<label
					for="nova-results-search"
					class="mb-3 block text-sm font-medium text-nova-ink"
				>
					Szukaj artykułów
				</label>

				<div class="flex gap-3">
					<input
						id="nova-results-search"
						type="search"
						name="s"
						value="{{ $searchQuery }}"
						placeholder="Wpisz szukaną frazę..."
						class="min-w-0 flex-1 border border-nova-line bg-nova-white px-5 py-4 text-sm text-nova-ink outline-none transition focus:border-nova-ink"
					/>

					<input type="hidden" name="post_type" value="post" />

					<button
						type="submit"
						class="shrink-0 bg-nova-ink px-6 py-4 text-sm font-medium text-nova-white transition hover:opacity-80"
					>
						Szukaj
					</button>
				</div>
			</form>

			@if (have_posts())
				<div class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
					@while (have_posts())
						@php (the_post())

						@include ('partials.post-card', [
                            'postId' => get_the_ID(),
                        ])
					@endwhile
				</div>

				@if ($wp_query->max_num_pages > 1)
					<nav class="nova-pagination mt-16" aria-label="Paginacja wyników wyszukiwania">
						{!! paginate_links([
                            'total' => $wp_query->max_num_pages,
                            'current' => max(1, get_query_var('paged')),
                            'mid_size' => 1,
                            'prev_text' => '← Poprzednia',
                            'next_text' => 'Następna →',
                            'type' => 'list',
                            'add_args' => [
                                'post_type' => 'post',
                            ],
                        ]) !!}
					</nav>
				@endif
			@else
				<div class="border-t border-nova-line py-12">
					<h2 class="font-serif text-2xl text-nova-ink">Nie znaleziono artykułów</h2>

					<p class="mt-4 text-base text-nova-muted">Spróbuj wpisać inną frazę lub wróć do bloga.</p>

					<a
						href="{{ get_permalink((int) get_option('page_for_posts')) ?: home_url('/') }}"
						class="mt-8 inline-flex border-b border-nova-ink pb-1 text-sm text-nova-ink"
					>
						← Wróć do bloga
					</a>
				</div>
			@endif
		</div>
	</section>
@endsection
