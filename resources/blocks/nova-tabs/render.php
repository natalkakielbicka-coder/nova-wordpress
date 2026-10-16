<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'min-w-0 max-w-full',
    'data-nova-tabs' => '',
]);
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
    <?php if ($tabs) : ?>
        <nav
            class="mb-6 flex max-w-full gap-6 overflow-x-auto overscroll-x-contain whitespace-nowrap border-b border-nova-line"
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
                    class="relative inline-flex shrink-0 items-center border-b-2 border-transparent px-1 py-3 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-selected:border-nova-ink aria-selected:text-nova-ink"
                >
                    <?php echo esc_html($tab['title']); ?>
                </button>
            <?php endforeach; ?>
        </nav>
    <?php endif; ?>

    <?php echo $content; ?>
</div>
