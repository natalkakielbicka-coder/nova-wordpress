<?php

namespace App\View\Composers;

use App\Repositories\ProjectRepository;
use Roots\Acorn\View\Composer;

class ProjectsSection extends Composer
{
    protected static $views = [
        'sections.projects',
    ];

    public function with(): array
    {
        $repository = new ProjectRepository();

        return [
            'projects' => $repository->getLatest(3),
        ];
    }
}
