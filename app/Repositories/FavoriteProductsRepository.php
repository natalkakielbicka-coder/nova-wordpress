<?php

namespace App\Repositories;

use WP_Error;

class FavoriteProductsRepository
{
    private const USER_META_KEY = 'nova_favorite_product_ids';

    public function getFavorites(int $userId): array
    {
        return $this->readStoredIds($userId);
    }

    public function addFavorite(int $userId, mixed $productId): array|WP_Error
    {
        $normalizedId = $this->normalizeProductId($productId);

        if (is_wp_error($normalizedId)) {
            return $normalizedId;
        }

        return $this->withUserLock($userId, function () use ($userId, $normalizedId): array|WP_Error {
            $favoriteIds = $this->readStoredIds($userId);

            if (in_array($normalizedId, $favoriteIds, true)) {
                return $favoriteIds;
            }

            $favoriteIds[] = $normalizedId;

            return $this->saveFavorites($userId, $favoriteIds);
        });
    }

    public function removeFavorite(int $userId, mixed $productId): array|WP_Error
    {
        $normalizedId = $this->normalizeProductId($productId);

        if (is_wp_error($normalizedId)) {
            return $normalizedId;
        }

        return $this->withUserLock($userId, function () use ($userId, $normalizedId): array|WP_Error {
            $favoriteIds = array_values(array_filter(
                $this->readStoredIds($userId),
                static fn (int $favoriteId): bool => $favoriteId !== $normalizedId
            ));

            return $this->saveFavorites($userId, $favoriteIds);
        });
    }

    public function mergeFavorites(int $userId, array $productIds): array|WP_Error
    {
        $normalizedIds = [];

        foreach ($productIds as $productId) {
            $normalizedId = $this->normalizeProductId($productId);

            if (is_wp_error($normalizedId)) {
                return $normalizedId;
            }

            if (! in_array($normalizedId, $normalizedIds, true)) {
                $normalizedIds[] = $normalizedId;
            }
        }

        return $this->withUserLock($userId, function () use ($userId, $normalizedIds): array|WP_Error {
            $mergedIds = $this->readStoredIds($userId);

            foreach ($normalizedIds as $normalizedId) {
                if (! in_array($normalizedId, $mergedIds, true)) {
                    $mergedIds[] = $normalizedId;
                }
            }

            return $this->saveFavorites($userId, $mergedIds);
        });
    }

    private function readStoredIds(int $userId): array
    {
        $storedIds = get_user_meta($userId, self::USER_META_KEY, true);

        if (! is_array($storedIds)) {
            return [];
        }

        $favoriteIds = [];

        foreach ($storedIds as $storedId) {
            $id = $this->positiveInteger($storedId);

            if ($id !== null && ! in_array($id, $favoriteIds, true)) {
                $favoriteIds[] = $id;
            }
        }

        return $favoriteIds;
    }

    private function normalizeProductId(mixed $productId): int|WP_Error
    {
        $id = $this->positiveInteger($productId);

        if ($id === null || ! function_exists('wc_get_product')) {
            return new WP_Error(
                'nova_invalid_favorite_product',
                __('A valid WooCommerce product is required.', 'nova-wordpress'),
                ['status' => 400]
            );
        }

        $product = wc_get_product($id);

        if (! ($product instanceof \WC_Product)) {
            return new WP_Error(
                'nova_invalid_favorite_product',
                __('The requested product does not exist.', 'nova-wordpress'),
                ['status' => 400]
            );
        }

        if ($product->is_type('variation')) {
            $parentId = (int) $product->get_parent_id();
            $product = $parentId > 0 ? wc_get_product($parentId) : false;
        }

        if (
            ! ($product instanceof \WC_Product)
            || $product->is_type('variation')
            || $product->get_status() !== 'publish'
        ) {
            return new WP_Error(
                'nova_invalid_favorite_product',
                __('The requested product is not available.', 'nova-wordpress'),
                ['status' => 400]
            );
        }

        return (int) $product->get_id();
    }

    private function positiveInteger(mixed $value): ?int
    {
        if (is_int($value)) {
            return $value > 0 ? $value : null;
        }

        if (! is_string($value) || $value === '' || ! ctype_digit($value)) {
            return null;
        }

        $id = (int) $value;

        return $id > 0 ? $id : null;
    }

    private function saveFavorites(int $userId, array $favoriteIds): array|WP_Error
    {
        $storedIds = get_user_meta($userId, self::USER_META_KEY, true);

        if ($storedIds === $favoriteIds) {
            return $favoriteIds;
        }

        if (! update_user_meta($userId, self::USER_META_KEY, $favoriteIds)) {
            wp_cache_delete($userId, 'user_meta');

            if (get_user_meta($userId, self::USER_META_KEY, true) === $favoriteIds) {
                return $favoriteIds;
            }

            return new WP_Error(
                'nova_favorites_save_failed',
                __('Favorites could not be saved.', 'nova-wordpress'),
                ['status' => 500]
            );
        }

        return $favoriteIds;
    }

    private function withUserLock(int $userId, callable $callback): array|WP_Error
    {
        global $wpdb;

        $lockName = 'nova_fav_' . substr(hash('sha256', $wpdb->prefix . ':' . $userId), 0, 55);
        $lockAcquired = $wpdb->get_var(
            $wpdb->prepare('SELECT GET_LOCK(%s, %d)', $lockName, 5)
        );

        if ((string) $lockAcquired !== '1') {
            return new WP_Error(
                'nova_favorites_lock_failed',
                __('Favorites are currently being updated. Please try again.', 'nova-wordpress'),
                ['status' => 503]
            );
        }

        try {
            wp_cache_delete($userId, 'user_meta');
            $result = $callback();
        } finally {
            $lockReleased = $wpdb->get_var(
                $wpdb->prepare('SELECT RELEASE_LOCK(%s)', $lockName)
            );
        }

        if ((string) $lockReleased !== '1') {
            return new WP_Error(
                'nova_favorites_lock_release_failed',
                __('Favorites could not be saved safely. Please try again.', 'nova-wordpress'),
                ['status' => 500]
            );
        }

        return $result;
    }
}
