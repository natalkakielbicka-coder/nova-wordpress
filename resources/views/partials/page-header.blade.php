@php
	$title = '';
	$description = '';

	if (is_home()) {
		$title = get_the_title(get_option('page_for_posts'));
		$description = get_the_excerpt(get_option('page_for_posts'));
	} elseif (function_exists('is_shop') && is_shop()) {
		$title = woocommerce_page_title(false);
		$shopPageId = wc_get_page_id('shop');
		$description = $shopPageId > 0 ? get_the_excerpt($shopPageId) : '';
	} elseif (is_category() || is_tag() || is_tax()) {
		$title = single_term_title('', false);
		$description = term_description();
	} elseif (is_post_type_archive()) {
		$title = post_type_archive_title('', false);
		$description = get_the_archive_description();
	} elseif (is_archive()) {
		$title = get_the_archive_title();
		$description = get_the_archive_description();
	} elseif (is_search()) {
		$title = 'Wyniki wyszukiwania';
		$description = 'Fraza: ' . get_search_query();
	} elseif (is_page()) {
		$title = get_the_title();
		$description = get_the_excerpt();
	} elseif (is_single()) {
		$title = get_the_title();
		$description = get_the_excerpt();
	}

	$description = wp_strip_all_tags($description ?? '');
@endphp

@if ($title)
	<section class="nova-page-banner border-b border-nova-line">
		<div class="mx-auto max-w-7xl py-16 md:py-20 lg:py-24">
			<div class="max-w-4xl">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">NOVA Studio</p>

				<h1
					class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl lg:text-7xl"
				>
					{{ $title }}
				</h1>

				@if ($description)
					<p class="mt-6 max-w-2xl text-base leading-8 text-nova-text md:text-lg">
						{{ $description }}
					</p>
				@endif
			</div>
		</div>
	</section>
@endif
