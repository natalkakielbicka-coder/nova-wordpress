@php (the_content())

@if ($pagination())
	<nav class="page-nav" aria-label="Page">{!! $pagination !!}</nav>
@endif

<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
	<x-nova-card
		variant="default"
		eyebrow="WORDPRESS"
		title="Projekt NOVA"
		description="Standardowa karta komponentu Blade."
	/>

	<x-nova-card
		variant="outlined"
		eyebrow="E-COMMERCE"
		title="WooCommerce"
		description="Wariant z mocniejszym obramowaniem."
	/>

	<x-nova-card
		variant="featured"
		eyebrow="WYRÓŻNIONY"
		title="Sage 10"
		description="Kontrastowa karta dla ważniejszych treści."
	/>
</div>
