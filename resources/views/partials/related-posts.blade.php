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

					@include ('partials.post-card', [
						'postId' => get_the_ID(),
					])
				@endwhile
			</div>
		</div>
	</section>
@endif

@php (wp_reset_postdata())
