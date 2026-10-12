@props ([
	'productId',
	'placementClass' => '',
])

<button
	type="button"
	disabled
	class="nova-favorite-toggle {{ $placementClass }} inline-flex size-11 items-center justify-center rounded-full bg-nova-white text-nova-muted shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
	data-product-id="{{ $productId }}"
	data-state="unknown"
	aria-label="{{ __('Sprawdzanie ulubionych', 'nova-wordpress') }}"
	aria-busy="true"
>
	<svg
		aria-hidden="true"
		class="size-5"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="1.75"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
		/>
	</svg>
</button>
