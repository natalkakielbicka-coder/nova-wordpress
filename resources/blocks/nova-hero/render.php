<?php
$eyebrow = $attributes['eyebrow'] ?? '';
$title = $attributes['title'] ?? '';
$text = $attributes['text'] ?? '';
$button_text = $attributes['buttonText'] ?? '';
$button_url = $attributes['buttonUrl'] ?? '';
$image_id = $attributes['imageId'] ?? 0;
$image_alt = $image_id
    ? get_post_meta($image_id, '_wp_attachment_image_alt', true)
    : '';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'nova-hero px-6 py-16 md:py-20 lg:py-24',
]);
?>

<?php echo '<!-- NOVA HERO RENDER TEST -->'; ?>
<section <?php echo $wrapper_attributes; ?>>
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
            <?php if ($eyebrow) : ?>
                <p class="nova-hero__eyebrow text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
                    <?php echo esc_html($eyebrow); ?>
                </p>
            <?php endif; ?>

            <?php if ($title) : ?>
                <h1 class="nova-hero__title mt-5 font-serif text-4xl leading-[1.05] text-nova-ink md:text-5xl lg:text-6xl">
                    <?php echo esc_html($title); ?>
                </h1>
            <?php endif; ?>

            <?php if ($text) : ?>
                <p class="nova-hero__text mt-6 max-w-xl text-base leading-7 text-nova-text">
                    <?php echo esc_html($text); ?>
                </p>
            <?php endif; ?>

            <?php if ($button_text && $button_url) : ?>
                <a
                    href="<?php echo esc_url($button_url); ?>"
                    class="nova-hero__buttons mt-8 inline-flex items-center bg-nova-ink px-6 py-3 text-sm font-medium text-nova-white transition hover:opacity-80"
                >
                    <?php echo esc_html($button_text); ?>
                    <span class="ml-3" aria-hidden="true">→</span>
                </a>
            <?php endif; ?>
        </div>

        <?php if ($image_id) : ?>
            <div class="nova-hero__image aspect-[4/5] overflow-hidden bg-nova-line">
                <?php
                echo wp_get_attachment_image(
                    $image_id,
                    'large',
                    false,
                    [
                        'class' => 'h-full w-full object-cover',
                        'alt' => $image_alt,
                    ]
                );
                ?>
            </div>
        <?php endif; ?>
    </div>
</section>