<?php
$eyebrow = $attributes['eyebrow'] ?? '';
$heading = $attributes['heading'] ?? '';
$items = $attributes['items'] ?? [];
$columns = (int) ($attributes['columns'] ?? 3);

$grid_classes = [
    2 => 'md:grid-cols-2',
    3 => 'md:grid-cols-3',
    4 => 'md:grid-cols-4',
];

$grid_class = $grid_classes[$columns] ?? $grid_classes[3];

$heading_alignment = (
    ($attributes['headingAlignment'] ?? 'left') === 'center'
)
    ? 'text-center'
    : 'text-left';

$animate = !empty($attributes['animate']);
?>

<section
    <?php echo get_block_wrapper_attributes([
        'class' => 'w-full',
    ]); ?>
    data-stats-animate="<?php echo $animate ? 'true' : 'false'; ?>"
>
    
    <?php if (trim(wp_strip_all_tags($eyebrow)) !== '' || trim(wp_strip_all_tags($heading)) !== '') : ?>
        
        <header class="mb-10 <?php echo esc_attr($heading_alignment); ?>">

            <?php if (trim(wp_strip_all_tags($eyebrow)) !== '') : ?>
                <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
                    <?php echo esc_html(wp_strip_all_tags($eyebrow)); ?>
                </p>
            <?php endif; ?>

            <?php if (trim(wp_strip_all_tags($heading)) !== '') : ?>
                <h2 class="mb-10 font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl">
                    <?php echo esc_html(wp_strip_all_tags($heading)); ?>
                </h2>
            <?php endif; ?>

        </header>
    <?php endif; ?>

    
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 <?php echo esc_attr($grid_class); ?>">
        <?php foreach ($items as $item) : ?>
            <?php
            if (!is_array($item)) {
                continue;
            }

            $value = $item['value'] ?? '';
            $label = $item['label'] ?? '';
            ?>

            <div class="border-t border-nova-line pt-6">
                <p class="min-w-0 break-words font-serif text-4xl leading-none tracking-tight text-nova-ink sm:text-5xl lg:text-6xl"  data-stats-counter>
                    <?php echo esc_html($value); ?>
                </p>

                <p class="mt-4 break-words text-sm leading-6 text-nova-text sm:text-base sm:leading-7">
                    <?php echo esc_html($label); ?>
                </p>
            </div>

        <?php endforeach; ?>
     </div>
</section>
