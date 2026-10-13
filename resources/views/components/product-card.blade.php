@php
    /** @var \WC_Product $product */
    $productUrl = get_permalink($product->get_id());
    $productName = $product->get_name();
    $favoriteProductId = $product->is_type('variation')
        ? (int) $product->get_parent_id()
        : (int) $product->get_id();
@endphp

<article class="nova-product-card group flex h-full min-w-0 flex-col">
	<div class="relative">
		<a href="{{ $productUrl }}" class="block">
			<div
				class="nova-product-card__image relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-nova-white p-6"
			>
				{!! $product->get_image('woocommerce_thumbnail', [
                    'class' => 'transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none',
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

		@if ($favoriteProductId > 0)
			<x-product-favorite-button
				:product-id="$favoriteProductId"
				placement-class="absolute right-4 top-4 z-10"
			/>
		@endif
	</div>

	<div class="mt-5 flex flex-1 flex-col">
		<h2 class="font-serif text-xl leading-snug">
			<a
				href="{{ $productUrl }}"
				class="text-nova-text transition-colors duration-300 group-hover:text-nova-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nova-ink motion-reduce:transition-none"
			>
				{{ $productName }}
			</a>
		</h2>

		<div class="mt-3 text-base font-medium text-nova-ink">
			{!! $product->get_price_html() !!}
		</div>

		<div class="nova-product-card__actions mt-auto pt-6">
			@php (woocommerce_template_loop_add_to_cart())
		</div>
	</div>
</article>
