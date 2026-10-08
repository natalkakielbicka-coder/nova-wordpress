<?php

$number_of_projects = $attributes['numberOfProjects'] ?? 3;
$title = $attributes['title'] ?? 'Wybrane projekty';

$projects = new WP_Query([
    'post_type' => 'project',
    'post_status' => 'publish',
    'posts_per_page' => $number_of_projects,
]);

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-6 py-20',
]);

if (!$projects->have_posts()) {
    return;
}
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="mx-auto max-w-7xl">
        <div class="flex flex-wrap items-center justify-between gap-6">
            <h2 class="font-serif text-4xl leading-tight text-nova-ink">
                <?php echo esc_html($title); ?>
            </h2>
            <div
                class="nova-projects-layout-switch flex items-center gap-2"
                role="group"
                aria-label="Układ projektów"
            >
                <button
                    type="button"
                    class="nova-layout-button is-active"
                    data-layout="grid"
                    aria-pressed="true"
                >
                    Siatka
                </button>

                <button
                    type="button"
                    class="nova-layout-button"
                    data-layout="list"
                    aria-pressed="false"
                >
                    Lista
                </button>
            </div>
        </div>

        <div class="nova-projects-grid mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <?php while ($projects->have_posts()) : ?>
                <?php $projects->the_post(); ?>

                <?php echo view('components.project-card')->render(); ?>
            <?php endwhile; ?>
        </div>

        <?php wp_reset_postdata(); ?>
    </div>
</section>