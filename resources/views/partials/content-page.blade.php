@php (the_content())

@if ($pagination())
	<nav class="page-nav" aria-label="Page">{!! $pagination !!}</nav>
@endif

<x-nova-card
	eyebrow="Projekt"
	title="Projekt NOVA"
	description="Nowoczesny motyw WordPress oparty na Sage 10, Blade i Tailwind CSS."
/>

<x-nova-card
	eyebrow="Projekt do nauki"
	title="WooCommerce"
	description="Rozbudowa sklepu internetowego o niestandardowe komponenty."
/>
