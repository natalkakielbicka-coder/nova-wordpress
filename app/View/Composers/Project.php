<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class Project extends Composer
{
    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'single-project',
    ];

    private function projectMeta(): array
    {
        return [
            'client' => get_field('project_client') ?: '',
            'year' => get_field('project_year') ?: '',
            'scope' => get_field('project_scope') ?: '',
            'technologies' => get_field('project_technologies') ?: '',
        ];
    }

    private function projectImage(): string
    {
        return get_the_post_thumbnail(
            get_the_ID(),
            'full',
            [
                'class' => 'h-full w-full object-cover',
            ]
        );
    }

    private function projectContent(): string
    {
        return apply_filters(
            'the_content',
            get_the_content()
        );
    }

    /**
     * Data passed to the view.
     */
    public function with(): array
    {
        return [
            'projectTitle' => get_the_title(),
            'projectMeta' =>  $this->projectMeta(),
            'projectImage' => $this->projectImage(),
            'projectContent' => $this->projectContent()
        ];
    }
}