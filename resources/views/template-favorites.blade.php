{{--
  Template Name: Ulubione produkty
--}}

@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php
			the_post();
		@endphp
		@include ('partials.page-header', ['title' => 'Ulubione produkty'])

		<section class="px-6 py-20 lg:py-28">
			<div class="mx-auto max-w-7xl">
				@php
					$shopUrl = function_exists('wc_get_page_permalink')
						? wc_get_page_permalink('shop')
						: '';
				@endphp

				<a
					id="nova-favorites-shop-link"
					href="{{ esc_url($shopUrl) }}"
					hidden
					class="mb-8 inline-flex bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
				>
					Przejdź do sklepu
				</a>

				<div
					id="nova-favorites-grid"
					class="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4"
				></div>
			</div>
		</section>
	@endwhile
@endsection
