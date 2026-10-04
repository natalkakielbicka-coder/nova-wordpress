<?php

namespace App;

add_filter('block_categories_all', function ($categories) {
    array_unshift($categories, [
        'slug' => 'nova',
        'title' => __('NOVA', 'nova-wordpress'),
    ]);

    return $categories;
});

add_action('init', function () {
    $blocks = [
        'nova-cta',
        'nova-projects',
        'nova-hero',
        'nova-content',
    ];

    foreach ($blocks as $block) {
        register_block_type(
            get_theme_file_path("resources/blocks/{$block}")
        );
    }
});