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

add_filter('allowed_block_types_all', function ($allowed_block_types, $block_editor_context) {
	$blocks = [
		'core/heading',
		'core/paragraph',
		'core/image',
		'core/list',
		'core/buttons',
		'core/button',
		'core/quote',
		'core/group',
		'core/query',
		'core/post-template',
		'core/post-featured-image',
		'core/post-title',
		'core/post-excerpt',
		'core/query-pagination',
		'core/query-pagination-previous',
		'core/query-pagination-numbers',
		'core/query-pagination-next',
		'core/query-no-results',

		'nova/cta',
		'nova/projects',
		'nova/hero',
		'nova/content',
		'nova/accordion',
		'nova/project-meta',
		'nova/project-meta-item',
	];

	$post_type = $block_editor_context->post->post_type ?? null;

	if ($post_type === 'project') {
		$blocks = array_diff($blocks, [
			'nova/hero',
			'nova/projects',
		]);
	}

	return array_values($blocks);
}, 10, 2);