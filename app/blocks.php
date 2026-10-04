<?php

namespace App;

add_action('init', function () {
    $blocks = [
        'nova-cta',
        'nova-projects',
    ];

    foreach ($blocks as $block) {
        register_block_type(
            get_theme_file_path("resources/blocks/{$block}")
        );
    }
});