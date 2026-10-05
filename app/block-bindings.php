<?php

namespace App;

add_action('init', function () {
    register_block_bindings_source('nova/project-field', [
        'label' => __('Project field', 'nova-wordpress'),
        'uses_context' => ['postId'],

        'get_value_callback' => function ($source_args, $block_instance, $attribute_name) {
            if (empty($source_args['key'])) {
                return null;
            }

            $post_id = $block_instance->context['postId'] ?? null;

            if (! $post_id) {
                return null;
            }

            return get_field($source_args['key'], $post_id) ?: null;
        },
    ]);
});