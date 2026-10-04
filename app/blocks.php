<?php

namespace App;

add_action('init', function () {
    $blocks = [
        'nova-cta',
        'nova-projects',
        'nova-hero',
    ];

    foreach ($blocks as $block) {
        register_block_type(
            get_theme_file_path("resources/blocks/{$block}")
        );
    }
});