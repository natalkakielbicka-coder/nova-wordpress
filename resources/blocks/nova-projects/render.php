<?php

$number_of_projects = $attributes['numberOfProjects'] ?? 3;
$title = $attributes['title'] ?? 'Wybrane projekty';

$projects = new WP_Query([
    'post_type' => 'project',
    'post_status' => 'publish',
    'posts_per_page' => $number_of_projects,
]);

if (!$projects->have_posts()) {
    return;
}
?>

<section class="px-6 py-20">
    <div class="mx-auto max-w-7xl">
        <h2 class="font-serif text-4xl leading-tight text-nova-ink">
            <?php echo esc_html($title); ?>
        </h2>

        <div class="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <?php while ($projects->have_posts()) : ?>
                <?php $projects->the_post(); ?>

                <?php echo view('components.project-card')->render(); ?>
            <?php endwhile; ?>
        </div>

        <?php wp_reset_postdata(); ?>
    </div>
</section>