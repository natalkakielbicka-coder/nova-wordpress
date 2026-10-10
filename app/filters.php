<?php
/**
 * Theme filters.
 */

namespace App;

/**
 * Add "… Continued" to the excerpt.
 *
 * @return string
 */
add_filter('excerpt_more', function () {
    return sprintf(' &hellip; <a href="%s">%s</a>', get_permalink(), __('Continued', 'sage'));
});

add_action('rest_api_init', function () {
    register_rest_field('post', 'reading_time', [
        'get_callback' => function ($post) {
            return \App\Support\ReadingTime::calculate(
                (int) $post['id']
            );
        },
        'schema' => [
            'description' => 'Estimated reading time in minutes.',
            'type' => 'integer',
            'context' => ['view'],
            'readonly' => true,
        ],
    ]);
});

add_action('rest_api_init', function () {
    register_rest_field('post', 'card_html', [
        'get_callback' => function ($post) {
            return view('partials.post-card', [
                'postId' => (int) $post['id'],
            ])->render();
        },
        'schema' => [
            'description' => 'Rendered NOVA blog card HTML.',
            'type' => 'string',
            'context' => ['view'],
            'readonly' => true,
        ],
    ]);
});

add_filter('wpseo_breadcrumb_links', function ($links) {
    if (! is_singular('project')) {
        return $links;
    }

    $archive_url = get_post_type_archive_link('project');

    if (! $archive_url) {
        return $links;
    }

    // Nie dodawaj drugi raz archiwum,
    // jeśli Yoast już uwzględnił je w ścieżce.
    foreach ($links as $link) {
        if (
            ($link['ptarchive'] ?? null) === 'project'
            || (
                isset($link['url'])
                && untrailingslashit($link['url']) === untrailingslashit($archive_url)
            )
        ) {
            return $links;
        }
    }

    // Wstaw Projekty bezpośrednio przed aktualnym wpisem.
    array_splice($links, -1, 0, [[
        'text' => 'Projekty',
        'url' => $archive_url,
    ]]);

    return $links;
});
