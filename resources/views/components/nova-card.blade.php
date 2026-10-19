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
        'p-6',
        $variantClasses,
    ]) }}>
	@if ($eyebrow)
		<p
			class="mb-4 text-xs font-medium uppercase tracking-[0.2em] {{ $isFeatured ? 'text-nova-background' : 'text-nova-muted' }}"
		>
			{{ $eyebrow }}
		</p>
	@endif

	@if ($title)
		<h3
			class="font-serif text-2xl leading-tight {{ $isFeatured ? 'text-nova-background' : 'text-nova-ink' }}"
		>
			{{ $title }}
		</h3>
	@endif

	@if ($description)
		<p
			class="mt-4 text-base leading-7 {{ $isFeatured ? 'text-nova-background' : 'text-nova-text' }}"
		>
			{{ $description }}
		</p>
	@endif

	@if (trim((string) $slot) !== '')
		<div class="mt-6 {{ $isFeatured ? 'text-nova-background' : 'text-nova-text' }}">
			{{ $slot }}
		</div>
	@endif
</article>
