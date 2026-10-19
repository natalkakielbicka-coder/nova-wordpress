<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class PageCards extends Composer
{
    protected static $views = [
        'partials.content-page',
    ];

    public function with(): array
    {
        $posts = get_posts([
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => 3,
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
