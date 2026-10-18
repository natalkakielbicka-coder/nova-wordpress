<?php

$heading = $attributes['heading'] ?? '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>
    <h2>
        <?php echo esc_html($heading); ?>
    </h2>
</section>
