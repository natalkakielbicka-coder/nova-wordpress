<?php
$title = $attributes['title'] ?? 'Nowa zakładka';
$panel_id = wp_unique_id('nova-tabs-panel-');
$wrapper_attributes = get_block_wrapper_attributes([
    'id' => $panel_id,
    'data-nova-tab-panel' => '',
    'aria-labelledby' => $panel_id . '-trigger',
]);

$block->context['nova/tabs/panelId'] = $panel_id;
?>

<div <?php echo $wrapper_attributes; ?>>
    <h3><?php echo esc_html($title); ?></h3>
    <?php echo $content; ?>
</div>
