<?php

namespace App\Repositories;

use App\Support\ProjectData;
use WP_Query;

class ProjectRepository
{
    public function getLatest(int $limit = 3): array
    {
        $query = new WP_Query([
            'post_type' => 'project',
            'post_status' => 'publish',
            'posts_per_page' => max(1, $limit),
            'no_found_rows' => true,
            'ignore_sticky_posts' => true,
        ]);

        return array_map(
            [ProjectData::class, 'fromPost'],
            $query->posts
        );
    }
}
