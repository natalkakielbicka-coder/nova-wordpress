<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class PageCards extends Composer
{
    protected static $views = [
        'sections.latest-posts',
    ];

    public function with(): array
    {
        $viewData = $this->view->getData();
        $postsCount = (int) ($viewData['postsCount'] ?? 3);
        $postsCount = max(1, min(12, $postsCount));
        $postType = $viewData['postType'] ?? 'post';
        $allowedPostTypes = ['post', 'project'];

        if (!in_array($postType, $allowedPostTypes, true)) {
            $postType = 'post';
        }

        $posts = get_posts([
            'post_type' => $postType,
            'post_status' => 'publish',
            'numberposts' => $postsCount,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $cards = array_map(function ($post) {
            return [
                'title' => get_the_title($post),
                'description' => get_the_excerpt($post),
                'url' => get_permalink($post),
            ];
        }, $posts);

        return [
            'cards' => $cards,
        ];
    }
}
