@php
    /** @var \WC_Product $product */
    $productUrl = get_permalink($product->get_id());
    $productName = $product->get_name();
@endphp

<article class="nova-product-card group flex h-full min-w-0 flex-col">
	<a href="{{ $productUrl }}" class="block">
		<div
			class="nova-product-card__image relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-nova-white p-6"
		>
			{!! $product->get_image('woocommerce_thumbnail', [
                'class' => 'transition duration-500 group-hover:scale-[1.03]',
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

	<div class="mt-5 flex flex-1 flex-col">
		<h2 class="font-serif text-xl leading-snug text-nova-ink">
			<a href="{{ $productUrl }}" class="transition hover:opacity-60"> {{ $productName }} </a>
		</h2>

		<div class="mt-3 text-base font-medium text-nova-ink">
			{!! $product->get_price_html() !!}
		</div>

		<div class="nova-product-card__actions mt-auto pt-6">
			@php (woocommerce_template_loop_add_to_cart())
		</div>
	</div>
</article>
