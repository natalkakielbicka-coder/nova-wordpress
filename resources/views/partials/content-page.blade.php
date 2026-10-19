@php (the_content())

@if ($pagination())
	<nav class="page-nav" aria-label="Page">{!! $pagination !!}</nav>
@endif

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	<x-nova-card
		eyebrow="WORDPRESS DEVELOPMENT"
		title="Projekt NOVA"
		description="Nowoczesny motyw WordPress oparty na Sage 10, Blade i Tailwind CSS."
		id="nova-featured-card"
		class="border-2 border-nova-ink"
		data-card-type="featured"
	>
		<a
			href="{{ home_url('/projekty/') }}"
			class="inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm font-medium text-nova-ink transition-opacity hover:opacity-60"
		>
			Zobacz projekty
			<span aria-hidden="true">→</span>
		</a>
	</x-nova-card>

	<x-nova-card
		eyebrow="E-COMMERCE"
		title="WooCommerce"
		description="Rozbudowa sklepów internetowych o niestandardowe komponenty i funkcjonalności."
	>
		<span class="text-sm font-medium text-nova-muted"> Sage 10 / PHP / WooCommerce </span>
	</x-nova-card>
</div>
