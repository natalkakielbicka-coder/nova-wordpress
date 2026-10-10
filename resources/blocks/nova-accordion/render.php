<?php

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-6 py-16 md:py-20',
]);

$items = $attributes['items'] ?? [];
$open_first_item = $attributes['openFirstItem'] ?? false;
$single_open = $attributes['singleOpen'] ?? false;
$accordion_id = wp_unique_id('nova-accordion-');
?>

<section
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="nova/accordion"
    data-wp-context='<?php echo esc_attr(wp_json_encode([
        'accordionId' => $accordion_id,
        'openFirstItem' => $open_first_item,
        'singleOpen' => $single_open,
    ])); ?>'
>
    <div class="mx-auto max-w-3xl">
        <div class="border-t border-nova-line">
            <?php foreach ($items as $index => $item) : ?>
            <?php $panel_id = "{$accordion_id}-panel-{$index}"; ?>
            <div
                class="border-b border-nova-line"
                data-nova-accordion-item
                data-wp-context='<?php echo esc_attr(wp_json_encode([
                    'isOpen' => $open_first_item && $index === 0,
                    'index' => $index,
                ])); ?>'

                data-wp-watch="callbacks.syncOpenState"
            >
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-6 py-6 text-left"
                    data-wp-on--click="actions.toggle"
                    data-wp-bind--aria-expanded="context.isOpen" aria-controls="<?php echo esc_attr($panel_id); ?>"
                >
                    <span class="font-serif text-xl text-nova-ink">
                        <?php echo wp_kses_post($item['question'] ?? ''); ?>
                    </span>

                    <span
                        class="nova-accordion__icon"
                        aria-hidden="true"
                        data-wp-class--is-open="context.isOpen"
                    >
                        +
                    </span>
                </button>

                <div
                    id="<?php echo esc_attr($panel_id); ?>"
                    class="nova-accordion__panel"
                    data-wp-class--is-open="context.isOpen"
                >
                    <div class="nova-accordion__panel-inner">
                        <div class="pb-6 text-nova-text">
                            <?php echo wp_kses_post($item['answer'] ?? ''); ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
        </div>
    </div>
</section>