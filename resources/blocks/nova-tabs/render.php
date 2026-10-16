<?php
$wrapper_attributes = get_block_wrapper_attributes([
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
        <nav>
            <?php foreach ($tabs as $tab) : ?>
                <?php $trigger_id = $tab['id'] . '-trigger'; ?>
                <button
                    type="button"
                    id="<?php echo esc_attr($trigger_id); ?>"
                    data-nova-tab-trigger
                    aria-controls="<?php echo esc_attr($tab['id']); ?>"
                >
                    <?php echo esc_html($tab['title']); ?>
                </button>
            <?php endforeach; ?>
        </nav>
    <?php endif; ?>

    <?php echo $content; ?>
</div>
