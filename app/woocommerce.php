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

    if (! is_shop() && ! is_product_taxonomy()) {
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
