@php
    /** @var \WC_Product $product */
    $productUrl = get_permalink($product->get_id());
    $productName = $product->get_name();
@endphp

<article class="group min-w-0">
	<a href="{{ $productUrl }}" class="block">
		<div class="relative aspect-[4/5] overflow-hidden bg-nova-white">
			{!! $product->get_image('woocommerce_thumbnail', [
                'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                'loading' => 'lazy',
            ]) !!}

			@if ($product->is_on_sale())
				<span
					class="absolute left-4 top-4 bg-nova-ink px-3 py-1.5 text-xs font-medium text-nova-white"
				>
					Promocja
				</span>
			@endif
		</div>
	</a>

	<div class="mt-5">
		<h2 class="font-serif text-xl leading-snug text-nova-ink">
			<a href="{{ $productUrl }}" class="transition hover:opacity-60"> {{ $productName }} </a>
		</h2>

		<div class="mt-3 text-base font-medium text-nova-ink">
			{!! $product->get_price_html() !!}
		</div>

		<a
			href="{{ $productUrl }}"
			class="mt-5 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
		>
			Zobacz produkt
			<span aria-hidden="true">→</span>
		</a>
	</div>
</article>
