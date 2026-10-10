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
