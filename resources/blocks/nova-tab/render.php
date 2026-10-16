<?php
$wrapper_attributes = get_block_wrapper_attributes();
$title = $attributes['title'] ?? 'Nowa zakładka';
?>

<div <?php echo $wrapper_attributes; ?>>
    <h3><?php echo esc_html($title); ?></h3>
    <?php echo $content; ?>
</div>
