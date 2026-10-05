<?php

$project_id = $block->context['nova/projectId'] ?? null;
$field = $attributes['field'] ?? 'project_client';

if (! $project_id) {
    return;
}

$value = get_field($field, $project_id);

if (! $value) {
    return;
}
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <?php echo esc_html($value); ?>
</div>