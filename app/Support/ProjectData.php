<?php

namespace App\Support;

use WP_Post;

class ProjectData
{
    public static function fromPost(WP_Post $post): array
    {
        return [
            'id' => $post->ID,
            'title' => get_the_title($post->ID),
            'url' => get_permalink($post->ID),
            'excerpt' => get_the_excerpt($post->ID),
            'image' => get_the_post_thumbnail(
                $post->ID,
                'large',
                [
                    'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                ]
            ),
        ];
    }
}
