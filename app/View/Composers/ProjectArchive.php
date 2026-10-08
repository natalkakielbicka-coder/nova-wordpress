<?php

namespace App\View\Composers;

use App\Support\ProjectData;
use Roots\Acorn\View\Composer;

class ProjectArchive extends Composer
{
    protected static $views = [
        'archive-project',
    ];

    public function with(): array
    {
        global $wp_query;

        return [
            'projects' => array_map(
                [ProjectData::class, 'fromPost'],
                $wp_query->posts
            ),
        ];
    }
}
