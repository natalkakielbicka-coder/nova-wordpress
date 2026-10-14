<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-4 py-12 sm:px-6 md:py-20',
]);

$eyebrow = $attributes['eyebrow'] ?? '';
$heading = $attributes['heading'] ?? '';
$description = $attributes['description'] ?? '';
$items = $attributes['items'] ?? [];
?>

<section <?php echo $wrapper_attributes; ?>>
    <?php if ($eyebrow || $heading || $description) : ?>
        <header class="mx-auto mb-8 max-w-3xl text-center md:mb-12">
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
                <p class="mx-auto mt-6 max-w-xl text-base leading-7 text-nova-text">
                    <?php echo esc_html($description); ?>
                </p>
            <?php endif; ?>
        </header>
    <?php endif; ?>

    <?php if ($items) : ?>
        <ol class="mx-auto max-w-3xl space-y-8 border-l border-nova-line pl-8">
            <?php foreach ($items as $item) : ?>
                <li class="relative">
                    <span
                        aria-hidden="true"
                        class="absolute -left-[2.35rem] top-1.5 size-3 rounded-full bg-nova-ink"
                    ></span>

                    <?php if (!empty($item['date'])) : ?>
                        <p class="text-sm font-medium text-nova-muted">
                            <?php echo esc_html($item['date']); ?>
                        </p>
                    <?php endif; ?>

                    <?php if (!empty($item['title'])) : ?>
                        <h3 class="mt-1 font-serif text-xl text-nova-ink">
                            <?php echo esc_html($item['title']); ?>
                        </h3>
                    <?php endif; ?>

                    <?php if (!empty($item['description'])) : ?>
                        <p class="mt-2 text-base leading-7 text-nova-text">
                            <?php echo esc_html($item['description']); ?>
                        </p>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ol>
    <?php endif; ?>
</section>
