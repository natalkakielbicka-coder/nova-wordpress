<?php

$heading = $attributes['heading'] ?? '';
$items = $attributes['items'] ?? [];
?>

<section <?php echo get_block_wrapper_attributes(); ?>>

    <?php if ($heading) : ?>
        <h2>
            <?php echo esc_html($heading); ?>
        </h2>
    <?php endif; ?>

    
<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">

    <?php foreach ($items as $item) : ?>
        <?php
        if (!is_array($item)) {
            continue;
        }

        $value = $item['value'] ?? '';
        $label = $item['label'] ?? '';
        ?>

        <div class="border-t border-nova-line pt-6">

            <p class="font-serif text-5xl text-nova-ink">
                <?php echo esc_html($value); ?>
            </p>

            <p class="mt-4 text-base text-nova-text">
                <?php echo esc_html($label); ?>
            </p>

        </div>

    <?php endforeach; ?>

</div>


</section>
