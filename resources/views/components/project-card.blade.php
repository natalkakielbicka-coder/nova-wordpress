<article>
	<a
		href="{{ get_permalink() }}"
		class="group block"
		aria-label="Zobacz projekt: {{ get_the_title() }}"
	>
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

		<p class="mt-5 text-xs uppercase tracking-[0.15em] text-nova-muted">
			{{ get_the_excerpt() }}
		</p>

		<h3 class="mt-2 font-serif text-2xl text-nova-ink">{{ get_the_title() }}</h3>

		<span
			class="mt-4 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink"
		>
			Zobacz projekt
			<span aria-hidden="true">→</span>
		</span>
	</a>
</article>
