<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'min-w-0 max-w-full',
    'data-nova-tabs' => '',
]);
$requested_variant = $attributes['styleVariant'] ?? 'underline';
$style_variant = in_array($requested_variant, ['underline', 'pills', 'segmented'], true)
    ? $requested_variant
    : 'underline';
$navigation_styles = [
    'underline' => [
        'nav' => 'mb-6 flex max-w-full gap-6 overflow-x-auto overscroll-x-contain whitespace-nowrap border-b border-nova-line',
        'tab' => 'relative inline-flex shrink-0 items-center border-b-2 border-transparent px-1 py-3 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-selected:border-nova-ink aria-selected:text-nova-ink',
    ],
    'pills' => [
        'nav' => 'mb-6 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap',
        'tab' => 'relative inline-flex shrink-0 items-center rounded-full border-0 px-4 py-2 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-selected:bg-nova-ink aria-selected:text-nova-white',
    ],
    'segmented' => [
        'nav' => 'mb-6 flex max-w-full gap-1 overflow-x-auto overscroll-x-contain whitespace-nowrap rounded-lg bg-nova-background p-1',
        'tab' => 'relative inline-flex shrink-0 items-center rounded-md border-0 px-4 py-2 text-sm font-medium text-nova-muted hover:bg-nova-white hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-selected:bg-nova-white aria-selected:text-nova-ink',
    ],
];
$style_classes = $navigation_styles[$style_variant];
$tabs = [];

if (isset($block->inner_blocks)) {
    foreach ($block->inner_blocks as $child) {
        if ($child->name !== 'nova/tab') {
            continue;
        }

        $panel_id = $child->context['nova/tabs/panelId'] ?? '';

        if (!is_string($panel_id) || $panel_id === '') {
            continue;
        }

        $title = $child->attributes['title'] ?? '';
        $title = is_string($title) ? trim($title) : '';
        $tabs[] = [
            'id' => $panel_id,
            'title' => $title !== '' ? $title : sprintf(
                /* translators: %d is the tab number. */
                __('Zakładka %d', 'nova-wordpress'),
                count($tabs) + 1
            ),
        ];
    }
}
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <?php if ($tabs) : ?>
            <nav
                class="<?php echo esc_attr($style_classes['nav']); ?>"
                aria-label="<?php echo esc_attr__('Nawigacja zakładek', 'nova-wordpress'); ?>"
                hidden
            >
                <?php foreach ($tabs as $tab) : ?>
                    <?php $trigger_id = $tab['id'] . '-trigger'; ?>
                    <button
                        type="button"
                        id="<?php echo esc_attr($trigger_id); ?>"
                        data-nova-tab-trigger
                        aria-controls="<?php echo esc_attr($tab['id']); ?>"
                        class="<?php echo esc_attr($style_classes['tab']); ?>"
                    >
                        <?php echo esc_html($tab['title']); ?>
                    </button>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>

        <?php echo $content; ?>
    </div>
</div>
