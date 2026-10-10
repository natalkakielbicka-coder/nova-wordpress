@php
    $currentPostId = get_the_ID();

    $categoryIds = wp_get_post_categories($currentPostId);

    $relatedPosts = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 3,
        'post__not_in' => [$currentPostId],
        'category__in' => $categoryIds ?: [0],
        'ignore_sticky_posts' => true,
        'no_found_rows' => true,
    ]);
@endphp

@if ($categoryIds && $relatedPosts->have_posts())
	<section class="border-t border-nova-line px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<div class="mb-12 flex flex-wrap items-end justify-between gap-6">
				<div>
					<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Z bloga</p>

					<h2 class="font-serif text-4xl leading-tight text-nova-ink md:text-5xl">
						Czytaj również
					</h2>
				</div>

				@php
                    $blogPageId = (int) get_option('page_for_posts');
                    $blogUrl = $blogPageId
                        ? get_permalink($blogPageId)
                        : home_url('/');
                @endphp

				<a
					href="{{ $blogUrl }}"
					class="border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
				>
					Wszystkie artykuły →
				</a>
			</div>

			<div class="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
				@while ($relatedPosts->have_posts())
					@php ($relatedPosts->the_post())

					<article class="group min-w-0">
						<a href="{{ get_permalink() }}" class="block">
							<div class="aspect-[4/3] overflow-hidden bg-nova-white">
								@if (has_post_thumbnail())
									{!! get_the_post_thumbnail(
                                        get_the_ID(),
                                        'large',
                                        [
                                            'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                                            'loading' => 'lazy',
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
									{{ \App\Support\ReadingTime::calculate(get_the_ID()) }} min
									czytania
								</span>
							</div>

							<h3
								class="mt-4 font-serif text-2xl leading-tight text-nova-ink transition group-hover:opacity-60"
							>
								{{ get_the_title() }}
							</h3>

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
		</div>
	</section>
@endif

@php (wp_reset_postdata())
