@php
    $postId = $project['id'] ?? get_the_ID();

    $title = $project['title'] ?? get_the_title($postId);
    $url = $project['url'] ?? get_permalink($postId);
    $excerpt = $project['excerpt'] ?? get_the_excerpt($postId);

    $image = $project['image'] ?? get_the_post_thumbnail(
        $postId,
        'large',
        [
            'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
        ]
    );
@endphp

<article class="nova-project-card">
	<a
		href="{{ $url }}"
		class="nova-project-card__link group block"
		aria-label="Zobacz projekt: {{ $title }}"
	>
		<div class="nova-project-card__image aspect-[4/3] overflow-hidden bg-nova-white">
			{!! $image !!}
		</div>

		<div class="nova-project-card__content">
			<p class="mt-5 text-xs uppercase tracking-[0.15em] text-nova-muted">{{ $excerpt }}</p>

			<h3 class="mt-2 font-serif text-2xl text-nova-ink">{{ $title }}</h3>

			<span
				class="mt-4 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink"
			>
				Zobacz projekt
				<span aria-hidden="true">→</span>
			</span>
		</div>
	</a>
</article>
