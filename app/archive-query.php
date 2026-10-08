<?php

namespace App;

use WP_Query;

add_action('pre_get_posts', function (WP_Query $query) {
    if (is_admin() || ! $query->is_main_query()) {
        return;
    }

    // Projekty - 6 na stronę.
    if ($query->is_post_type_archive('project')) {
        $query->set('posts_per_page', 6);
        return;
    }

    // Blog - 9 wpisów na stronę.
    if ($query->is_home()) {
        $query->set('posts_per_page', 9);
    }
});
