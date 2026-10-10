<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-4 py-12 sm:px-6 md:py-20',
]);

$items = $attributes['items'] ?? [];
$eyebrow = $attributes['eyebrow'] ?? '';
$heading = $attributes['heading'] ?? '';
$description = $attributes['description'] ?? '';
$open_first_item = $attributes['openFirstItem'] ?? false;
$single_open = $attributes['singleOpen'] ?? false;
$accordion_id = wp_unique_id('nova-accordion-');
$heading_alignment = ($attributes['headingAlignment'] ?? 'center') === 'left'
    ? 'text-left'
    : 'text-center';
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
        <div class="border-t border-nova-line pt-10">
        
            <?php if ($eyebrow || $heading || $description) : ?>
                <header class="mb-12 md:mb-16 <?php echo esc_attr($heading_alignment); ?>">

                    <?php if ($eyebrow) : ?>
                        <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
                            <?php echo esc_html($eyebrow); ?>
                        </p>
                    <?php endif; ?>

                    <?php if ($heading) : ?>
                        <h2 class="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl">
                            <?php echo esc_html($heading); ?>
                        </h2>
                    <?php endif; ?>

                    <?php if ($description) : ?>
                        <p class="<?php echo $heading_alignment === 'text-center' ? 'mx-auto ' : ''; ?>mt-6 max-w-xl text-base leading-7 text-nova-text">
                            <?php echo esc_html($description); ?>
                        </p>
                    <?php endif; ?>

                </header>
            <?php endif; ?>

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
                    class="flex w-full items-center justify-between gap-4 py-5 text-left md:gap-6 md:py-6"
                    data-wp-on--click="actions.toggle"
                    data-wp-bind--aria-expanded="context.isOpen" aria-controls="<?php echo esc_attr($panel_id); ?>"
                >
                    <span class="font-serif text-lg leading-snug text-nova-ink md:text-xl">
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