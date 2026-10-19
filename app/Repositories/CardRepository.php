<?php

namespace App\Repositories;
use App\Contracts\CardRepositoryInterface;
use WP_Post;

class CardRepository implements CardRepositoryInterface
{
    public function getLatest(
        string $postType = 'post',
        int $limit = 3
    ): array {
        $allowedPostTypes = ['post', 'project'];

        if (!in_array($postType, $allowedPostTypes, true)) {
            $postType = 'post';
        }

        $limit = max(1, min(12, $limit));

        // Unikalny klucz cache dla typu i liczby wpisów.
        $cacheKey = sprintf(
            'nova_cards_%s_%d',
            $postType,
            $limit
        );

        // 1. Sprawdź zapisane dane.
        $cached = get_transient($cacheKey);

        if ($cached !== false) {
            return $cached;
        }

        // 2. Pobierz dane, jeśli cache nie istnieje.
        $posts = get_posts([
            'post_type' => $postType,
            'post_status' => 'publish',
            'numberposts' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $cards = array_map(
            fn (WP_Post $post) => [
                'title' => get_the_title($post),
                'description' => get_the_excerpt($post),
                'url' => get_permalink($post),
            ],
            $posts
        );

        // 3. Zapisz wynik na 5 minut.
        set_transient(
            $cacheKey,
            $cards,
            5 * MINUTE_IN_SECONDS
        );

        return $cards;
    }
}
