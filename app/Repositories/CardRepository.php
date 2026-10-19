<?php

namespace App\Repositories;
use App\Contracts\CardRepositoryInterface;

use WP_Post;

class CardRepository implements CardRepositoryInterface
{
    public function getLatest(
        string $postType = 'post',
        int $limit = 3
    ): array {
        $allowedPostTypes = ['post', 'project'];

        if (!in_array($postType, $allowedPostTypes, true)) {
            $postType = 'post';
        }

        $limit = max(1, min(12, $limit));

        $posts = get_posts([
            'post_type' => $postType,
            'post_status' => 'publish',
            'numberposts' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        return array_map(
            fn (WP_Post $post) => [
                'title' => get_the_title($post),
                'description' => get_the_excerpt($post),
                'url' => get_permalink($post),
            ],
            $posts
        );
    }
}
