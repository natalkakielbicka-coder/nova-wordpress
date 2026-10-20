<?php

namespace App;

add_action('rest_api_init', function () {
    register_rest_route('nova/v1', '/status', [
        'methods' => 'GET',

        'callback' => function () {
            return rest_ensure_response([
                'success' => true,
                'message' => 'NOVA REST API działa!',
            ]);
        },

        'permission_callback' => '__return_true',
    ]);
});
