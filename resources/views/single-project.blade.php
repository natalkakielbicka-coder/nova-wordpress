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
	@endwhile
@endsection
