@php (the_content())

@if ($pagination())
	<nav class="page-nav" aria-label="Page">{!! $pagination !!}</nav>
@endif

@if (!empty($cards))
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		@foreach ($cards as $card)
			<x-nova-card
				eyebrow="BLOG"
				:title="$card['title']"
				:description="$card['description']"
				variant="default"
			>
				<x-slot:footer>
					<a
						href="{{ $card['url'] }}"
						class="text-sm font-medium text-nova-ink hover:opacity-60"
					>
						Czytaj więcej →
					</a>
				</x-slot:footer>
			</x-nova-card>
		@endforeach
	</div>
@endif
