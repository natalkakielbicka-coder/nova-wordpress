@extends ('layouts.app')

@section ('content')
	@php
        do_action('woocommerce_before_main_content');

        $isSingleProduct = function_exists('is_product') && is_product();

        $shopUrl = $isSingleProduct && function_exists('wc_get_page_permalink')
            ? wc_get_page_permalink('shop')
            : '';
    @endphp

	@if ($shopUrl)
		<a
			href="{{ esc_url($shopUrl) }}"
			class="mb-6 inline-flex items-center gap-2 text-sm text-nova-muted transition-colors hover:text-nova-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nova-ink"
		>
			<svg
				aria-hidden="true"
				class="size-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.75"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>

			<span>{{ __('Wróć do sklepu', 'nova-wordpress') }}</span>
		</a>
	@endif

	@php
        woocommerce_content();
        do_action('woocommerce_after_main_content');
    @endphp
@endsection
