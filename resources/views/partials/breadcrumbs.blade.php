@php
    $breadcrumbs = [];

    $homeUrl = home_url('/');

    $blogPageId = (int) get_option('page_for_posts');

    $blogUrl = $blogPageId
        ? get_permalink($blogPageId)
        : $homeUrl;

    $breadcrumbs[] = [
        'label' => 'Strona główna',
        'url' => $homeUrl,
    ];

    // Blog
    if (is_home()) {
        $breadcrumbs[] = [
            'label' => 'Blog',
            'url' => null,
        ];

    // Archiwum projektów
    } elseif (is_post_type_archive('project')) {
        $breadcrumbs[] = [
            'label' => 'Projekty',
            'url' => null,
        ];

    // Pojedynczy projekt
    } elseif (is_singular('project')) {
        $breadcrumbs[] = [
            'label' => 'Projekty',
            'url' => get_post_type_archive_link('project'),
        ];

        $breadcrumbs[] = [
            'label' => get_the_title(get_queried_object_id()),
            'url' => null,
        ];

    // Pojedynczy wpis
    } elseif (is_singular('post')) {
        $breadcrumbs[] = [
            'label' => 'Blog',
            'url' => $blogUrl,
        ];

        $breadcrumbs[] = [
            'label' => get_the_title(get_queried_object_id()),
            'url' => null,
        ];

    // Podstrony
    } elseif (is_page()) {
        $pageId = get_queried_object_id();

        $ancestors = array_reverse(
            get_post_ancestors($pageId)
        );

        foreach ($ancestors as $ancestorId) {
            $breadcrumbs[] = [
                'label' => get_the_title($ancestorId),
                'url' => get_permalink($ancestorId),
            ];
        }

        $breadcrumbs[] = [
            'label' => get_the_title($pageId),
            'url' => null,
        ];

    // Kategorie
    } elseif (is_category()) {
        $term = get_queried_object();

        $breadcrumbs[] = [
            'label' => 'Blog',
            'url' => $blogUrl,
        ];

        $ancestors = array_reverse(
            get_ancestors($term->term_id, 'category', 'taxonomy')
        );

        foreach ($ancestors as $ancestorId) {
            $ancestor = get_term($ancestorId, 'category');

            if ($ancestor && !is_wp_error($ancestor)) {
                $breadcrumbs[] = [
                    'label' => $ancestor->name,
                    'url' => get_term_link($ancestor),
                ];
            }
        }

        $breadcrumbs[] = [
            'label' => $term->name,
            'url' => null,
        ];

    // Tagi
    } elseif (is_tag()) {
        $term = get_queried_object();

        $breadcrumbs[] = [
            'label' => 'Blog',
            'url' => $blogUrl,
        ];

        $breadcrumbs[] = [
            'label' => $term->name,
            'url' => null,
        ];

    // Wyniki wyszukiwania
    } elseif (is_search()) {
        $breadcrumbs[] = [
            'label' => 'Wyniki wyszukiwania: ' . get_search_query(false),
            'url' => null,
        ];

    // Strona 404
    } elseif (is_404()) {
        $breadcrumbs[] = [
            'label' => 'Nie znaleziono strony',
            'url' => null,
        ];
    }

    // Dane strukturalne
    $schemaItems = [];

    foreach ($breadcrumbs as $index => $breadcrumb) {
        $schemaItems[] = [
            '@type' => 'ListItem',
            'position' => $index + 1,
            'name' => $breadcrumb['label'],
            'item' => $breadcrumb['url'] ?: get_pagenum_link(),
        ];
    }

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => $schemaItems,
    ];
@endphp

@if (count($breadcrumbs) > 1)
	<nav class="border-b border-nova-line px-6 py-4" aria-label="Ścieżka nawigacji">
		<ol class="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-xs text-nova-muted">
			@foreach ($breadcrumbs as $breadcrumb)
				<li class="flex items-center gap-2">
					@if (!$loop->first)
						<span aria-hidden="true">/</span>
					@endif

					@if ($breadcrumb['url'])
						<a href="{{ $breadcrumb['url'] }}" class="transition hover:text-nova-ink">
							{{ $breadcrumb['label'] }}
						</a>
					@else
						<span class="text-nova-ink" aria-current="page">
							{{ $breadcrumb['label'] }}
						</span>
					@endif
				</li>
			@endforeach
		</ol>
	</nav>

	<script type="application/ld+json">
		{!! wp_json_encode(
		    $schema,
		    JSON_UNESCAPED_UNICODE |
		    JSON_UNESCAPED_SLASHES |
		    JSON_HEX_TAG |
		    JSON_HEX_AMP |
		    JSON_HEX_APOS |
		    JSON_HEX_QUOT
		) !!}
	</script>
@endif
