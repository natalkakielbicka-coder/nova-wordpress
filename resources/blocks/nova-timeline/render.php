<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-4 py-12 sm:px-6 md:py-20',
]);

$eyebrow = $attributes['eyebrow'] ?? '';
$heading = $attributes['heading'] ?? '';
$description = $attributes['description'] ?? '';
$layout = in_array($attributes['layout'] ?? 'alternating', ['vertical', 'alternating'], true)
    ? $attributes['layout']
    : 'alternating';
$is_alternating = $layout === 'alternating';
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
        <div class="relative mx-auto w-full max-w-5xl">
            <span
                aria-hidden="true"
                class="absolute inset-y-0 border-l border-nova-line <?php echo $is_alternating ? 'left-1.5 md:left-1/2' : 'left-1.5'; ?>"
            ></span>

            <ol class="space-y-8">
                <?php foreach ($items as $index => $item) : ?>
                    <?php $is_left = $index % 2 === 0; ?>
                    <li class="<?php echo $is_alternating ? 'relative grid min-w-0 grid-cols-1 pl-8 md:grid-cols-2 md:gap-x-12 md:pl-0' : 'relative min-w-0 pl-8'; ?>">
                        <span
                            aria-hidden="true"
                            class="absolute left-1.5 top-1.5 size-3 -translate-x-1/2 rounded-full bg-nova-ink <?php echo $is_alternating ? 'md:left-1/2' : ''; ?>"
                        ></span>

                        <div class="min-w-0 <?php echo $is_alternating ? ($is_left ? 'md:col-start-1 md:pr-8 md:text-right' : 'md:col-start-2 md:pl-8 md:text-left') : ''; ?>">
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
                        </div>
                    </li>
                <?php endforeach; ?>
            </ol>
        </div>
    <?php endif; ?>
</section>
