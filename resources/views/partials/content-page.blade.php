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
	>
		<x-slot:image>
			<img
				src="{{ Vite::asset('resources/images/nova-hero.png') }}"
				alt="Projekt NOVA"
				class="h-full w-full object-cover"
				loading="lazy"
			/>
		</x-slot:image>

		<x-slot:footer>
			<a
				href="{{ get_post_type_archive_link('project') }}"
				class="inline-flex items-center gap-2 text-sm font-medium text-nova-ink hover:opacity-60"
			>
				Zobacz projekty
				<span aria-hidden="true">→</span>
			</a>
		</x-slot:footer>
	</x-nova-card>

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
