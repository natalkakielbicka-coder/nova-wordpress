<?php
use App\Repositories\ProjectRepository;
$number_of_projects = $attributes['numberOfProjects'] ?? 3;
$title = $attributes['title'] ?? 'Wybrane projekty';

$repository = app(ProjectRepository::class);
$projects = $repository->getLatest((int) $number_of_projects);

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-6 py-20',
]);

if (empty($projects)) {
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
            <?php foreach ($projects as $project) : ?>
                <?php
                echo view('components.project-card', [
                    'project' => $project,
                ])->render();
                ?>
            <?php endforeach; ?>
        </div>

    </div>
</section>