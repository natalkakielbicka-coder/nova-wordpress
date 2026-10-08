<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use WP_Query;

class ProjectsSection extends Composer
{
    protected static $views = [
        'sections.projects',
    ];

    public function with(): array
    {
        $query = new WP_Query([
            'post_type' => 'project',
            'post_status' => 'publish',
            'posts_per_page' => 3,
            'no_found_rows' => true,
            'ignore_sticky_posts' => true,
        ]);

        $projects = array_map(
            static function ($post): array {
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
            },
            $query->posts
        );

        return [
            'projects' => $projects,
        ];
    }
}
