<?php
namespace App;

add_action('init', function () {
    register_post_type('project', [
        'labels' => [
            'name' => 'Projekty',
            'singular_name' => 'Projekt',
            'add_new' => 'Dodaj projekt',
            'add_new_item' => 'Dodaj nowy projekt',
            'edit_item' => 'Edytuj projekt',
            'new_item' => 'Nowy projekt',
            'view_item' => 'Zobacz projekt',
            'search_items' => 'Szukaj projektów',
            'not_found' => 'Nie znaleziono projektów',
            'all_items' => 'Wszystkie projekty',
        ],

        'public' => true,
        'show_in_rest' => true,
        'has_archive' => true,

        'menu_icon' => 'dashicons-portfolio',

        'supports' => [
            'title',
            'editor',
            'thumbnail',
            'excerpt',
        ],

        'rewrite' => [
            'slug' => 'projekty',
        ],
    ]);

    register_post_type('testimonial', [
        'labels' => [
            'name' => 'Opinie',
            'singular_name' => 'Opinia',
            'add_new' => 'Dodaj opinię',
            'add_new_item' => 'Dodaj nową opinię',
            'edit_item' => 'Edytuj opinię',
            'all_items' => 'Wszystkie opinie',
        ],

        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,

        'menu_icon' => 'dashicons-format-quote',

        'supports' => [
            'title',
            'editor',
        ],
    ]);
});