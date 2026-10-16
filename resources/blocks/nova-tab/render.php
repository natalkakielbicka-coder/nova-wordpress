<?php
$title = $attributes['title'] ?? 'Nowa zakładka';
$panel_id = wp_unique_id('nova-tabs-panel-');
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'min-w-0 max-w-full pt-6 text-base leading-8 text-nova-text',
    'id' => $panel_id,
    'data-nova-tab-panel' => '',
    'aria-labelledby' => $panel_id . '-trigger',
]);

$block->context['nova/tabs/panelId'] = $panel_id;
?>

<div <?php echo $wrapper_attributes; ?>>
    <h3 class="mb-4 mt-0 font-serif text-2xl leading-tight text-nova-ink">
        <?php echo esc_html($title); ?>
    </h3>
    <?php echo $content; ?>
</div>
