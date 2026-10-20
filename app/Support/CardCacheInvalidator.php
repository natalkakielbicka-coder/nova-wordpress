<?php

namespace App\Support;

use App\Contracts\CardRepositoryInterface;
use WP_Post;

class CardCacheInvalidator
{
    public function __construct(
        protected CardRepositoryInterface $repository
    ) {}

    public function register(): void
    {
        add_action(
            'wp_after_insert_post',
            [$this, 'afterInsert'],
            10,
            4
        );

        add_action(
            'before_delete_post',
            [$this, 'beforeDelete'],
            10,
            2
        );
    }

    public function afterInsert(
        int $postId,
        WP_Post $post,
        bool $update,
        ?WP_Post $postBefore
    ): void {
        if (
            wp_is_post_revision($postId) ||
            wp_is_post_autosave($postId)
        ) {
            return;
        }

        $this->invalidate($post);
    }

    public function beforeDelete(
        int $postId,
        WP_Post $post
    ): void {
        $this->invalidate($post);
    }

    private function invalidate(WP_Post $post): void
    {
        if (!in_array(
            $post->post_type,
            ['post', 'project'],
            true
        )) {
            return;
        }

        $this->repository->clearCache();
    }
}
