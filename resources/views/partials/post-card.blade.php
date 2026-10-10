@php
    $postId = (int) $postId;
    $categories = get_the_category($postId);
    $postUrl = get_permalink($postId);
    $postTitle = get_the_title($postId);
@endphp

<article class="group min-w-0">
	<a href="{{ $postUrl }}" class="block" aria-label="Przeczytaj: {{ $postTitle }}">
		<div class="aspect-[4/3] overflow-hidden bg-nova-white">
			@if (has_post_thumbnail($postId))
				{!! get_the_post_thumbnail(
                    $postId,
                    'large',
                    [
                        'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                        'loading' => 'lazy',
                    ]
                ) !!}
			@endif
		</div>
	</a>

	<div
		class="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.12em] text-nova-muted"
	>
		<time datetime="{{ get_the_date('c', $postId) }}">
			{{ get_the_date('d.m.Y', $postId) }}
		</time>

		@if ($categories)
			<span aria-hidden="true">/</span>

			<span>
				@foreach ($categories as $category)
					<a
						href="{{ get_category_link($category->term_id) }}"
						class="transition hover:text-nova-ink hover:underline"
					>
						{{ $category->name }}
					</a>
					@if (!$loop->last) , @endif
				@endforeach
			</span>
		@endif

		<span aria-hidden="true">/</span>

		<span class="inline-flex items-center gap-1.5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
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

			{{ \App\Support\ReadingTime::calculate($postId) }} min czytania
		</span>
	</div>

	<h2 class="mt-4 font-serif text-2xl leading-tight text-nova-ink">
		<a href="{{ $postUrl }}" class="transition hover:opacity-60"> {{ $postTitle }} </a>
	</h2>

	<p class="mt-4 line-clamp-3 text-sm leading-7 text-nova-text">{{ get_the_excerpt($postId) }}</p>

	<a
		href="{{ $postUrl }}"
		class="mt-6 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
	>
		Czytaj więcej
		<span aria-hidden="true">→</span>
	</a>
</article>
