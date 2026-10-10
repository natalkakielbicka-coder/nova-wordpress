@php
    $readingTime = \App\Support\ReadingTime::calculate(get_the_ID());
@endphp

<article @php (post_class('h-entry'))>
	<header class="px-6 pb-12 pt-20 lg:pb-16 lg:pt-28">
		<div class="mx-auto max-w-4xl text-center">
			<div
				class="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-nova-muted"
			>
				@foreach (get_the_category() as $category)
					<a
						href="{{ get_category_link($category->term_id) }}"
						class="transition hover:text-nova-ink"
					>
						{{ $category->name }}
					</a>
				@endforeach

				<span aria-hidden="true">/</span>

				<time class="dt-published" datetime="{{ get_the_date('c') }}">
					{{ get_the_date('d.m.Y') }}
				</time>
			</div>

			<h1
				class="p-name mx-auto max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-nova-ink sm:text-5xl lg:text-6xl"
			>
				{{ get_the_title() }}
			</h1>

			@if (has_excerpt())
				<p class="mx-auto mt-8 max-w-2xl text-lg leading-8 text-nova-text">
					{{ get_the_excerpt() }}
				</p>
			@endif

			<div
				class="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-nova-muted"
			>
				<span>
					Autor:
					<a
						href="{{ get_author_posts_url(get_the_author_meta('ID')) }}"
						class="p-author h-card text-nova-ink transition hover:opacity-60"
					>
						{{ get_the_author() }}
					</a>
				</span>

				<span aria-hidden="true">/</span>

				<span class="inline-flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="9" />
						<path d="M12 7v5l3 2" />
					</svg>

					{{ $readingTime }} min czytania
				</span>
			</div>
		</div>
	</header>

	@if (has_post_thumbnail())
		<figure class="px-6">
			<div class="mx-auto max-w-6xl overflow-hidden">
				{!! get_the_post_thumbnail(
                    get_the_ID(),
                    'full',
                    [
                        'class' => 'aspect-[16/9] h-auto w-full object-cover',
                        'loading' => 'eager',
                    ]
                ) !!}
			</div>

			@if (get_the_post_thumbnail_caption())
				<figcaption class="mx-auto mt-3 max-w-6xl text-xs text-nova-muted">
					{{ get_the_post_thumbnail_caption() }}
				</figcaption>
			@endif
		</figure>
	@endif

	<div class="px-6 pb-20 pt-14 lg:pb-28 lg:pt-20">
		<div class="mx-auto max-w-3xl">
			<div class="nova-article-content e-content text-base leading-8 text-nova-text">
				@php (the_content())
			</div>

			@if ($pagination())
				<nav class="mt-10" aria-label="Strony artykułu">{!! $pagination !!}</nav>
			@endif

			@if (has_tag())
				<div class="mt-14 flex flex-wrap items-center gap-3 border-t border-nova-line pt-8">
					<span class="text-sm text-nova-muted">Tagi:</span>

					@foreach (get_the_tags() ?: [] as $tag)
						<a
							href="{{ get_tag_link($tag->term_id) }}"
							class="border border-nova-line px-3 py-1.5 text-xs text-nova-text transition hover:border-nova-ink hover:text-nova-ink"
						>
							{{ $tag->name }}
						</a>
					@endforeach
				</div>
			@endif

			<div
				class="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-nova-line pt-8"
			>
				<a
					href="{{ get_permalink((int) get_option('page_for_posts')) ?: home_url('/') }}"
					class="text-sm text-nova-ink transition hover:opacity-60"
				>
					← Wszystkie artykuły
				</a>

				@if (get_next_post())
					<a
						href="{{ get_permalink(get_next_post()) }}"
						class="text-sm text-nova-ink transition hover:opacity-60"
					>
						Następny wpis →
					</a>
				@endif
			</div>
		</div>
	</div>

	@if (comments_open() || get_comments_number())
		<div class="mx-auto max-w-3xl px-6 pb-20">
			@php (comments_template())
		</div>
	@endif
</article>
