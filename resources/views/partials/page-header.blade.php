<section class="nova-page-banner border-b border-nova-line">
	<div class="border-b border-nova-line">
		<div class="mx-auto max-w-7xl">
			@include ('partials.breadcrumbs')
		</div>
	</div>

	<div class="mx-auto max-w-7xl py-12 md:py-14 lg:py-16">
		<div class="max-w-4xl">
			<p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">NOVA / Studio</p>
			<h1
				class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl lg:text-7xl"
			>
				@if (function_exists('is_order_received_page') && is_order_received_page())
					Dziękujemy za zamówienie
				@else
					{!! $title !!}
				@endif
			</h1>
			@if (is_page() && has_excerpt())
				<p class="mt-6 max-w-2xl text-base leading-8 text-nova-text md:text-lg">
					{{ get_the_excerpt() }}
				</p>
			@endif
		</div>
	</div>
</section>
