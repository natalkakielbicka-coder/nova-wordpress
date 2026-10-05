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
        'nova-accordion',
        'nova-project-meta',
        'nova-project-meta-item',
    ];

    foreach ($blocks as $block) {
        register_block_type(
            get_theme_file_path("resources/blocks/{$block}")
        );
    }
});

add_action('wp_enqueue_scripts', function () {
    wp_register_script_module(
        'nova/accordion',
        get_theme_file_uri('resources/blocks/nova-accordion/view.js'),
        ['@wordpress/interactivity']
    );

    wp_enqueue_script_module('nova/accordion');
});