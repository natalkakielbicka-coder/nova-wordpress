<?php

namespace App\View\Composers;

use App\Repositories\CardRepository;
use Roots\Acorn\View\Composer;

class PageCards extends Composer
{
    protected static $views = [
        'sections.latest-posts',
    ];

    public function __construct(
        protected CardRepository $repository
    ) {}

    public function with(): array
    {
        $viewData = $this->view->getData();

        $postsCount = (int) (
            $viewData['postsCount'] ?? 3
        );

        $postType = $viewData['postType'] ?? 'post';

        return [
            'cards' => $this->repository->getLatest(
                $postType,
                $postsCount
            ),
        ];
    }
}
