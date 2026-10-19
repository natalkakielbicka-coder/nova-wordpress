@props ([
    'eyebrow' => '',
    'title' => '',
    'description' => '',
])

<article class="border border-nova-line bg-nova-white p-6">
	@if ($eyebrow)
		<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
			{{ $eyebrow }}
		</p>
	@endif

	@if ($title)
		<h3 class="font-serif text-2xl leading-tight text-nova-ink">{{ $title }}</h3>
	@endif

	@if ($description)
		<p class="mt-4 text-base leading-7 text-nova-text">{{ $description }}</p>
	@endif

	@if (trim((string) $slot) !== '')
		<div class="mt-6">{{ $slot }}</div>
	@endif
</article>
