{{--
  Template Name: O mnie
--}}

@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php
			the_post();

			$eyebrow = get_field('about_eyebrow');
			$intro = get_field('about_intro');
			$image = get_field('about_image');
			$heading = get_field('about_heading');
			$description = get_field('about_description');
		@endphp

		<section class="px-6 py-20 lg:py-28">
			<div class="mx-auto max-w-7xl">
				<div class="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
					<div>
						@if ($eyebrow)
							<p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
								{{ $eyebrow }}
							</p>
						@endif

						<h1
							class="font-serif text-5xl leading-[1.05] tracking-tight text-nova-ink md:text-6xl lg:text-7xl"
						>
							{{ get_the_title() }}
						</h1>
					</div>

					<div class="max-w-xl lg:pb-2">
						@if ($intro)
							<p class="text-lg leading-8 text-nova-text">{{ $intro }}</p>
						@endif
					</div>
				</div>
			</div>
		</section>

		<section class="px-6 pb-24 lg:pb-32">
			<div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
				@if ($image)
					<div class="overflow-hidden">
						{!! wp_get_attachment_image(
					$image,
					'large',
					false,
					[
						'class' => 'aspect-[4/5] h-full w-full object-cover',
					]
				) !!}
					</div>
				@endif

				<div class="max-w-xl">
					@if ($heading)
						<h2 class="font-serif text-3xl leading-tight text-nova-ink md:text-4xl">
							{{ $heading }}
						</h2>
					@endif

					@if ($description)
						<div class="about-content mt-7 text-base leading-8 text-nova-text">
							{!! wp_kses_post($description) !!}
						</div>
					@endif
				</div>
			</div>
		</section>

		@if (have_rows('about_skills'))
			<section class="border-t border-nova-line px-6 py-24 lg:py-32">
				<div class="mx-auto max-w-7xl">
					<div class="grid gap-12 lg:grid-cols-[1fr_2fr]">
						<div>
							<p class="text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Kompetencje</p>

							<h2
								class="mt-4 max-w-sm font-serif text-3xl leading-tight text-nova-ink md:text-4xl"
							>
								W czym mogę pomóc
							</h2>
						</div>

						<div class="divide-y divide-nova-line border-t border-nova-line">
							@while (have_rows('about_skills'))
								@php (the_row())

								<div class="grid gap-3 py-7 sm:grid-cols-[1fr_2fr] sm:gap-8">
									<h3 class="font-serif text-xl text-nova-ink">
										{{ get_sub_field('name') }}
									</h3>

									<p class="leading-7 text-nova-muted">
										{{ get_sub_field('description') }}
									</p>
								</div>
							@endwhile
						</div>
					</div>
				</div>
			</section>
		@endif

	@endwhile
@endsection
