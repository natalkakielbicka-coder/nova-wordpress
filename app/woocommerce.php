<?php

namespace App;

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
});

/**
 * Prepare Mini-Cart block assets before wp_head().
 */
add_action('wp', function () {
    if (! class_exists('WooCommerce')) {
        return;
    }

    if (! class_exists('WP_Block_Type_Registry')) {
        return;
    }

    $block = \WP_Block_Type_Registry::get_instance()
        ->get_registered('woocommerce/mini-cart');

    if (! $block) {
        return;
    }

    foreach ((array) $block->script_handles as $handle) {
        wp_enqueue_script($handle);
    }

    foreach ((array) $block->view_script_handles as $handle) {
        wp_enqueue_script($handle);
    }
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
