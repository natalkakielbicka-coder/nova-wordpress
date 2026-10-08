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
        return [
            'projects' => new WP_Query([
                'post_type' => 'project',
                'post_status' => 'publish',
                'posts_per_page' => 3,
                'no_found_rows' => true,
                'ignore_sticky_posts' => true,
            ]),
        ];
    }
}
