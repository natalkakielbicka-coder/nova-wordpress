<section id="projekty" class="bg-nova-white px-6 py-24 lg:py-32">
	<div class="mx-auto max-w-7xl">
		<div class="mb-14 flex items-end justify-between gap-8">
			<div>
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Portfolio</p>

				<h2
					class="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl"
				>
					Wybrane projekty
				</h2>
			</div>

			<a
				href="{{ get_post_type_archive_link('project') }}"
				class="inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
			>
				Zobacz wszystkie
				<span aria-hidden="true">→</span>
			</a>
		</div>

		@if (count($projects))
			<div class="grid gap-10 md:grid-cols-3">
				@foreach ($projects as $project)
					<x-project-card :project="$project" />
				@endforeach
			</div>
		@endif
	</div>
</section>
