<?php

$heading = $attributes['heading'] ?? '';
$items = $attributes['items'] ?? [];

$first_item = $items[0] ?? [];

$value = $first_item['value'] ?? '';
$label = $first_item['label'] ?? '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>

    <?php if ($heading) : ?>
        <h2>
            <?php echo esc_html($heading); ?>
        </h2>
    <?php endif; ?>

    <div class="mt-8 border-t border-nova-line pt-6">

        <p class="font-serif text-5xl text-nova-ink">
            <?php echo esc_html($value); ?>
        </p>

        <p class="mt-4 text-base text-nova-text">
            <?php echo esc_html($label); ?>
        </p>

    </div>

</section>
