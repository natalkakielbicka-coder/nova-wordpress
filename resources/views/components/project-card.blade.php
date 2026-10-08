<article class="nova-project-card">
	<a
		href="{{ $project['url'] }}"
		class="nova-project-card__link group block"
		aria-label="Zobacz projekt: {{ $project['title'] }}"
	>
		<div class="nova-project-card__image aspect-[4/3] overflow-hidden bg-nova-white">
			{!! $project['image'] !!}
		</div>

		<div class="nova-project-card__content">
			<p class="mt-5 text-xs uppercase tracking-[0.15em] text-nova-muted">{{ $project['excerpt'] }}</p>

			<h3 class="mt-2 font-serif text-2xl text-nova-ink">{{ $project['title'] }}</h3>

			<span
				class="mt-4 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink"
			>
				Zobacz projekt
				<span aria-hidden="true">→</span>
			</span>
		</div>
	</a>
</article>
