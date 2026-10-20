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

    register_rest_route('nova/v1', '/projects', [
        'methods' => 'GET',

        'callback' => function (\WP_REST_Request $request) {
            $limit = $request->get_param('limit');

            $repository = app(
                \App\Repositories\ProjectRepository::class
            );

            $projects = $repository->getLatest($limit);

            $data = array_map(
                fn (array $project) => [
                    'id' => $project['id'],
                    'title' => $project['title'],
                    'url' => $project['url'],
                    'excerpt' => $project['excerpt'],
                ],
                $projects
            );

            return rest_ensure_response([
                'success' => true,
                'count' => count($data),
                'projects' => $data,
            ]);
        },

        'permission_callback' => '__return_true',

        'args' => [
            'limit' => [
                'description' => 'Liczba projektów do pobrania.',
                'type' => 'integer',
                'default' => 6,
                'minimum' => 1,
                'maximum' => 12,
                'required' => false,
            ],
        ],
    ]);
});
