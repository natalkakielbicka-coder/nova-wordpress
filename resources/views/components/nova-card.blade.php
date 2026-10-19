@props ([
    'eyebrow' => '',
    'title' => '',
    'description' => '',
    'variant' => 'default',
])

@php
    $variantClasses = match ($variant) {
        'outlined' => 'border-2 border-nova-ink bg-transparent',
        'featured' => 'border border-nova-ink bg-nova-ink',
        default => 'border border-nova-line bg-nova-white',
    };

    $isFeatured = $variant === 'featured';
@endphp

<article {{ $attributes->class([
        'overflow-hidden',
        $variantClasses,
    ]) }}>
	{{-- Zdjęcie karty --}}
	@isset ($image)
		<div class="aspect-[4/3] overflow-hidden">{{ $image }}</div>
	@endisset

	<div class="p-6">
		{{-- Nadtytuł --}}
		@if ($eyebrow)
			<p
				class="mb-4 text-xs font-medium uppercase tracking-[0.2em] {{ $isFeatured ? 'text-nova-background' : 'text-nova-muted' }}"
			>
				{{ $eyebrow }}
			</p>
		@endif

		{{-- Tytuł --}}
		@if ($title)
			<h3
				class="font-serif text-2xl leading-tight {{ $isFeatured ? 'text-nova-background' : 'text-nova-ink' }}"
			>
				{{ $title }}
			</h3>
		@endif

		{{-- Opis --}}
		@if ($description)
			<p
				class="mt-4 text-base leading-7 {{ $isFeatured ? 'text-nova-background' : 'text-nova-text' }}"
			>
				{{ $description }}
			</p>
		@endif

		{{-- Główna zawartość --}}
		@if (trim((string) $slot) !== '')
			<div class="mt-6">{{ $slot }}</div>
		@endif

		{{-- Stopka karty --}}
		@isset ($footer)
			<div class="mt-6 border-t border-nova-line pt-4">{{ $footer }}</div>
		@endisset
	</div>
</article>
