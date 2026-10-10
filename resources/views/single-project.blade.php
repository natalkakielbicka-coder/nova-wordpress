@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php
      the_post();

    @endphp

		<section class="px-6 py-20 lg:py-28">
			<div class="mx-auto max-w-7xl">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Projekt</p>

				<h1
					class="max-w-4xl font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl"
				>
					{{$projectTitle}}
				</h1>

				<div class="mt-16 border-t border-nova-line pt-8">
					<div class="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4">
						@if ($projectMeta['client'])
							<div>
								<p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">Klient</p>

								<p class="text-base text-nova-ink">{{ $projectMeta['client'] }}</p>
							</div>
						@endif

						@if ($projectMeta['year'])
							<div>
								<p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">Rok</p>

								<p class="text-base text-nova-ink">{{ $projectMeta['year'] }}</p>
							</div>
						@endif

						@if ($projectMeta['scope'])
							<div>
								<p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">Zakres prac</p>

								<p class="text-base leading-6 text-nova-ink">{{ $projectMeta['scope'] }}</p>
							</div>
						@endif

						@if ($projectMeta['technologies'])
							<div>
								<p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">Technologie</p>

								<p class="text-base leading-6 text-nova-ink">{{ $projectMeta['technologies'] }}</p>
							</div>
						@endif
					</div>
				</div>
			</div>
		</section>

		@if ($projectImage)
			<section class="px-6 pb-20 lg:pb-28">
				<div class="mx-auto max-w-7xl">
					<div class="aspect-[16/9] overflow-hidden">{!! $projectImage !!}</div>
				</div>
			</section>
		@endif

		<section class="px-6 pb-24 lg:pb-32">
			<div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_2fr]">
				<div>
					<p class="text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">O projekcie</p>
				</div>

				<div class="max-w-3xl">
					<div class="project-content">{!! $projectContent !!}</div>
				</div>
			</div>
		</section>

		@php
			$currentProjectId = get_the_ID();

			$relatedProjects = get_posts([
				'post_type' => 'project',
				'posts_per_page' => 3,
				'post__not_in' => [$currentProjectId],
				'orderby' => 'date',
				'order' => 'DESC',
			]);
		@endphp

		@if (!empty($relatedProjects))
			<section class="px-6 pb-20 lg:pb-28">
				<div class="mx-auto max-w-7xl">
					<div class="mb-12">
						<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Portfolio</p>

						<h2 class="font-serif text-4xl tracking-tight text-nova-ink md:text-5xl">
							Zobacz również
						</h2>
					</div>

					<div class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
						@foreach ($relatedProjects as $relatedPost)
							@php
                        $relatedProjectId = $relatedPost->ID;

                        $relatedProject = [
                            'url' => get_permalink($relatedProjectId),
                            'title' => get_the_title($relatedProjectId),
                            'excerpt' => get_the_excerpt($relatedProjectId),
                            'image' => get_the_post_thumbnail(
                                $relatedProjectId,
                                'large',
                                [
                                    'class' => 'h-full w-full object-cover',
                                    'loading' => 'lazy',
									'decoding' => 'async',
									'fetchpriority' => 'auto',
                                ]
                            ),
                        ];
                    	@endphp

							@include ('components.project-card', [
                        'project' => $relatedProject,
                    ])
						@endforeach
					</div>
				</div>
			</section>
		@endif

		@php
			$previousProject = get_previous_post();
			$nextProject = get_next_post();
			$projectsUrl = get_post_type_archive_link('project');
		@endphp

		<section class="border-t border-nova-line px-6 py-16 lg:py-24">
			<div class="mx-auto max-w-7xl">
				<div class="grid gap-6 md:grid-cols-2">
					@if ($previousProject)
						<a
							href="{{ get_permalink($previousProject) }}"
							class="group border border-nova-line p-6 transition hover:border-nova-ink md:p-8"
						>
							<span class="text-xs uppercase tracking-[0.15em] text-nova-muted">
								← Poprzedni projekt
							</span>

							<h2
								class="mt-4 font-serif text-2xl text-nova-ink transition group-hover:opacity-60"
							>
								{{ get_the_title($previousProject) }}
							</h2>
						</a>
					@endif

					@if ($nextProject)
						<a
							href="{{ get_permalink($nextProject) }}"
							class="group border border-nova-line p-6 text-right transition hover:border-nova-ink md:p-8"
						>
							<span class="text-xs uppercase tracking-[0.15em] text-nova-muted">
								Następny projekt →
							</span>

							<h2
								class="mt-4 font-serif text-2xl text-nova-ink transition group-hover:opacity-60"
							>
								{{ get_the_title($nextProject) }}
							</h2>
						</a>
					@endif
				</div>

				@if ($projectsUrl)
					<div class="mt-10 text-center">
						<a
							href="{{ $projectsUrl }}"
							class="inline-flex border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
						>
							← Wszystkie projekty
						</a>
					</div>
				@endif
			</div>
		</section>

	@endwhile
@endsection
