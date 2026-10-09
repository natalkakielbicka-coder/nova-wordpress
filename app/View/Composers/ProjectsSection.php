<?php

namespace App\View\Composers;

use App\Repositories\ProjectRepository;
use Roots\Acorn\View\Composer;

class ProjectsSection extends Composer
{
    protected static $views = [
        'sections.projects',
    ];

    public function __construct(
        protected ProjectRepository $repository
    ) {}

    public function with(): array
    {
        return [
            'projects' => $this->repository->getLatest(3),
        ];
    }
}
