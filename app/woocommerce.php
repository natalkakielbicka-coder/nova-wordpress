<?php

namespace App;

use App\Repositories\FavoriteProductsRepository;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

add_action('after_setup_theme', function () {
    if (! class_exists('WooCommerce')) {
        return;
    }

    // Usuwamy domyślne wrappery WooCommerce.
    remove_action(
        'woocommerce_before_main_content',
        'woocommerce_output_content_wrapper',
        10
    );

    remove_action(
        'woocommerce_after_main_content',
        'woocommerce_output_content_wrapper_end',
        10
    );

    // Dodajemy wrapper zgodny z layoutem NOVA.
    add_action('woocommerce_before_main_content', function () {
        echo '<section class="px-6 py-20 lg:py-28">';
        echo '<div class="mx-auto max-w-7xl">';
    }, 10);

    add_action('woocommerce_after_main_content', function () {
        echo '</div>';
        echo '</section>';
    }, 10);
}, 20);

add_action('rest_api_init', function () {
    if (! class_exists('WooCommerce') || ! function_exists('wc_get_product')) {
        return;
    }

    $permissionCallback = static function () {
        if (! is_user_logged_in()) {
            return new WP_Error(
                'nova_favorites_auth_required',
                __('Authentication is required to manage favorites.', 'nova-wordpress'),
                ['status' => 401]
            );
        }

        if (! current_user_can('read')) {
            return new WP_Error(
                'nova_favorites_forbidden',
                __('You are not allowed to manage favorites.', 'nova-wordpress'),
                ['status' => 403]
            );
        }

        return true;
    };

    $repository = static fn (): FavoriteProductsRepository => app(FavoriteProductsRepository::class);

    $mutationResponse = static function (array|WP_Error $result) {
        if (is_wp_error($result)) {
            return $result;
        }

        return new WP_REST_Response([
            'product_ids' => $result,
        ]);
    };

    register_rest_route('nova/v1', '/favorites', [
        [
            'methods' => 'GET',
            'callback' => static function () use ($repository) {
                return new WP_REST_Response([
                    'product_ids' => $repository()->getFavorites(get_current_user_id()),
                ]);
            },
            'permission_callback' => $permissionCallback,
        ],
        [
            'methods' => 'POST',
            'callback' => static function (WP_REST_Request $request) use ($repository, $mutationResponse) {
                return $mutationResponse(
                    $repository()->addFavorite(
                        get_current_user_id(),
                        $request->get_param('product_id')
                    )
                );
            },
            'args' => [
                'product_id' => [
                    'required' => true,
                    'type' => 'integer',
                    'minimum' => 1,
                ],
            ],
            'permission_callback' => $permissionCallback,
        ],
        [
            'methods' => 'DELETE',
            'callback' => static function (WP_REST_Request $request) use ($repository, $mutationResponse) {
                return $mutationResponse(
                    $repository()->removeFavorite(
                        get_current_user_id(),
                        $request->get_param('product_id')
                    )
                );
            },
            'args' => [
                'product_id' => [
                    'required' => true,
                    'type' => 'integer',
                    'minimum' => 1,
                ],
            ],
            'permission_callback' => $permissionCallback,
        ],
    ]);

    register_rest_route('nova/v1', '/favorites/merge', [
        'methods' => 'POST',
        'callback' => static function (WP_REST_Request $request) use ($repository, $mutationResponse) {
            return $mutationResponse(
                $repository()->mergeFavorites(
                    get_current_user_id(),
                    $request->get_param('product_ids')
                )
            );
        },
        'args' => [
            'product_ids' => [
                'required' => true,
                'type' => 'array',
                'items' => [
                    'type' => 'integer',
                    'minimum' => 1,
                ],
            ],
        ],
        'permission_callback' => $permissionCallback,
    ]);
});

add_action('rest_api_init', function () {
    if (! class_exists('WooCommerce') || ! function_exists('wc_get_product')) {
        return;
    }

    register_rest_route('nova/v1', '/favorites/render', [
        'methods' => 'POST',
        'callback' => static function (WP_REST_Request $request) {
            $payload = $request->get_json_params();
            $productIds = is_array($payload) ? ($payload['product_ids'] ?? null) : null;
            $maxProducts = 50;

            if (! is_array($payload) || ! is_array($productIds) || ! array_is_list($productIds)) {
                return new WP_Error(
                    'nova_favorites_render_invalid_request',
                    __('A list of product IDs is required.', 'nova-wordpress'),
                    ['status' => 400]
                );
            }

            if (count($productIds) > $maxProducts) {
                return new WP_Error(
                    'nova_favorites_render_too_many_products',
                    __('Too many product IDs were provided.', 'nova-wordpress'),
                    ['status' => 400]
                );
            }

            $validatedIds = [];
            $seenIds = [];

            foreach ($productIds as $productId) {
                if (! is_int($productId) || $productId < 1 || isset($seenIds[$productId])) {
                    return new WP_Error(
                        'nova_favorites_render_invalid_product_ids',
                        __('Product IDs must be unique positive integers.', 'nova-wordpress'),
                        ['status' => 400]
                    );
                }

                $seenIds[$productId] = true;
                $validatedIds[] = $productId;
            }

            $html = '';
            $renderedIds = [];
            $seenRenderedIds = [];

            foreach ($validatedIds as $requestedId) {
                $product = wc_get_product($requestedId);

                if (! $product instanceof \WC_Product || $product->get_status() !== 'publish') {
                    continue;
                }

                if ($product->is_type('variation')) {
                    $parentId = (int) $product->get_parent_id();
                    $product = $parentId > 0 ? wc_get_product($parentId) : false;
                }

                if (
                    ! $product instanceof \WC_Product
                    || $product->get_status() !== 'publish'
                    || ! $product->is_visible()
                    || ! in_array($product->get_catalog_visibility(), ['visible', 'catalog'], true)
                    || get_post_field('post_password', $product->get_id()) !== ''
                ) {
                    continue;
                }

                $productId = (int) $product->get_id();

                if (isset($seenRenderedIds[$productId])) {
                    continue;
                }

                $hadGlobalProduct = array_key_exists('product', $GLOBALS);
                $previousGlobalProduct = $GLOBALS['product'] ?? null;

                try {
                    $GLOBALS['product'] = $product;
                    $html .= view('components.product-card', [
                        'product' => $product,
                    ])->render();
                } finally {
                    if ($hadGlobalProduct) {
                        $GLOBALS['product'] = $previousGlobalProduct;
                    } else {
                        unset($GLOBALS['product']);
                    }
                }

                $seenRenderedIds[$productId] = true;
                $renderedIds[] = $productId;
            }

            return new WP_REST_Response([
                'html' => $html,
                'product_ids' => $renderedIds,
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
});


/**
 * Custom NOVA product cards.
 */
add_action('wp', function () {
    if (! function_exists('is_shop')) {
        return;
    }

    if (! is_shop() && ! is_product_taxonomy() && ! is_product()) {
        return;
    }

    // Usuwamy domyślną zawartość karty produktu.
    remove_action('woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10);
    remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10);
    remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
    remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);
    remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5);
    remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);
    remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5);
    remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);

    add_action('woocommerce_shop_loop_item_title', function () {
        global $product;

        if (! $product instanceof \WC_Product) {
            return;
        }

        echo view('components.product-card', [
            'product' => $product,
        ])->render();
    }, 10);
});

/**
 * WooCommerce product columns.
 */
add_filter('loop_shop_columns', function () {
    return 4;
});

add_filter('woocommerce_output_related_products_args', function ($args) {
    $args['posts_per_page'] = 4;
    $args['columns'] = 4;

    return $args;
});

/**
 * Custom shop archive header.
 */
add_action('wp', function () {
    if (! function_exists('is_shop')) {
        return;
    }

    if (! is_shop() && ! is_product_taxonomy()) {
        return;
    }

    remove_action('woocommerce_shop_loop_header', 'woocommerce_product_taxonomy_archive_header', 10);
    remove_action('woocommerce_before_shop_loop', 'woocommerce_result_count', 20);
    remove_action('woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30);

    add_action('woocommerce_before_shop_loop', function () {
        ?>
        <div class="mb-12 flex flex-col gap-6 border-b border-nova-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
                <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
                    Collection
                </p>

                <h1 class="font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl">
                    <?php echo esc_html(woocommerce_page_title(false)); ?>
                </h1>
            </div>

            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <div class="text-sm text-nova-muted">
                    <?php woocommerce_result_count(); ?>
                </div>

                <div class="text-sm text-nova-text">
                    <?php woocommerce_catalog_ordering(); ?>
                </div>
            </div>
        </div>
        <?php
    }, 20);
});

/**
 * Remove default WooCommerce breadcrumbs.
 */
add_action('init', function () {
    remove_action(
        'woocommerce_before_main_content',
        'woocommerce_breadcrumb',
        20
    );
});

/**
 * Remove default WooCommerce archive title.
 */
add_filter('woocommerce_show_page_title', '__return_false');

/**
 * Custom single product layout.
 */
add_action('wp', function () {
    if (! function_exists('is_product') || ! is_product()) {
        return;
    }

    remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10);

    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50);

    add_action('woocommerce_single_product_summary', function () {
        echo '<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Collection / NOVA</p>';
    }, 4);

    add_action('woocommerce_single_product_summary', function () {
        global $product;

        if (! $product instanceof \WC_Product) {
            return;
        }

        $favoriteProductId = $product->is_type('variation')
            ? (int) $product->get_parent_id()
            : (int) $product->get_id();

        if ($favoriteProductId < 1) {
            return;
        }

        echo view('components.product-favorite-button', [
            'productId' => $favoriteProductId,
            'placementClass' => 'mb-4',
        ])->render();
    }, 6);
});

/**
 * Custom order confirmation message.
 */
add_filter('woocommerce_thankyou_order_received_text', function ($message, $order) {
    if (! $order instanceof \WC_Order) {
        return $message;
    }

    return 'Zamówienie zostało przyjęte. Szczegóły znajdziesz poniżej.';
}, 10, 2);

/**
 * Fix missing WooCommerce Store API URL on cart and checkout pages.
 */
add_action('wp', function () {
    if (! function_exists('is_cart') || ! function_exists('wp_interactivity_state')) {
        return;
    }

    if (! is_cart() && ! is_checkout()) {
        return;
    }

    $state = wp_interactivity_state('woocommerce');

    if (empty($state['restUrl'])) {
        wp_interactivity_state('woocommerce', [
            'restUrl' => get_rest_url(),
            'noticeId' => '',
        ]);
    }
}, 20);
