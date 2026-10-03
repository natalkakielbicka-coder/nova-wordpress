@php
	$testimonials = new WP_Query([
		'post_type' => 'testimonial',
		'post_status' => 'publish',
		'posts_per_page' => -1,
	]);
@endphp

@if ($testimonials->have_posts())
	<section class="border-y border-nova-line bg-nova-white px-6 py-24 lg:py-32">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center">
				<p class="text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">Opinie klientów</p>
			</div>

			<div class="swiper testimonials-slider">
				<div class="swiper-wrapper">
					@while ($testimonials->have_posts())
						@php
							$testimonials->the_post();

							$position = get_field('testimonial_position');
							$company = get_field('testimonial_company');
						@endphp

						<div class="swiper-slide">
							<blockquote class="mx-auto max-w-4xl text-center">
								<p class="font-serif text-3xl leading-tight text-nova-ink md:text-4xl lg:text-5xl">„{{ wp_strip_all_tags(get_the_content()) }}”</p>

								<footer class="mt-8">
									<p class="text-sm font-medium text-nova-ink">
										{{ get_the_title() }}
									</p>

									@if ($position || $company)
										<p class="mt-1 text-sm text-nova-muted">
											{{ collect([$position, $company])->filter()->implode(' • ') }}
										</p>
									@endif
								</footer>
							</blockquote>
						</div>
					@endwhile
				</div>

				<div class="mt-12 flex items-center justify-center gap-5">
					<button
						type="button"
						class="testimonial-prev flex size-11 items-center justify-center border border-nova-line transition hover:border-nova-ink"
						aria-label="Poprzednia opinia"
					>
						<span aria-hidden="true">←</span>
					</button>

					<div class="testimonial-pagination !w-auto"></div>

					<button
						type="button"
						class="testimonial-next flex size-11 items-center justify-center border border-nova-line transition hover:border-nova-ink"
						aria-label="Następna opinia"
					>
						<span aria-hidden="true">→</span>
					</button>
				</div>
			</div>
		</div>
	</section>

	@php (wp_reset_postdata())
@endif
