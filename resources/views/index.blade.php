@extends ('layouts.app')

@section ('content')
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

			@if (have_posts())
				<div class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
					@while (have_posts())
						@php (the_post())

						<article class="group min-w-0">
							<a href="{{ get_permalink() }}" class="block">
								<div class="aspect-[4/3] overflow-hidden bg-nova-white">
									@if (has_post_thumbnail())
										{!! get_the_post_thumbnail(
                                        get_the_ID(),
                                        'large',
                                        [
                                            'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                                        ]
                                    ) !!}
									@endif
								</div>

								<div
									class="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.12em] text-nova-muted"
								>
									<time datetime="{{ get_the_date('c') }}">
										{{ get_the_date('d.m.Y') }}
									</time>

									<span aria-hidden="true">/</span>

									<span>
										{{ wp_strip_all_tags(get_the_category_list(', ')) }}
									</span>
								</div>

								<h2
									class="mt-4 font-serif text-2xl leading-tight text-nova-ink transition group-hover:opacity-60"
								>
									{{ get_the_title() }}
								</h2>

								<p class="mt-4 line-clamp-3 text-sm leading-7 text-nova-text">
									{{ get_the_excerpt() }}
								</p>

								<span
									class="mt-6 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink"
								>
									Czytaj więcej
									<span aria-hidden="true">→</span>
								</span>
							</a>
						</article>

					@endwhile
				</div>

				<nav class="nova-pagination mt-16" aria-label="Paginacja bloga">
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
