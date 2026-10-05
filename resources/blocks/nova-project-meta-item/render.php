<?php

$project_id = $block->context['nova/projectId'] ?? null;

if (! $project_id) {
    return;
}

$project = get_post($project_id);

if (! $project) {
    return;
}
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <?php echo esc_html(get_the_title($project_id)); ?>
</div>