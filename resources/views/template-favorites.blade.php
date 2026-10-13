{{--
  Template Name: Ulubione produkty
--}}

@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php
			the_post();
		@endphp
		@include ('partials.page-header', ['title' => 'Ulubione produkty'])

		<section id="nova-favorites-page" tabindex="-1" class="px-6 py-20 lg:py-28">
			<div class="mx-auto max-w-7xl">
				@php
					$shopUrl = function_exists('wc_get_page_permalink')
						? wc_get_page_permalink('shop')
						: '';
				@endphp

				<a
					id="nova-favorites-shop-link"
					href="{{ esc_url($shopUrl) }}"
					hidden
					class="mb-8 inline-flex bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
				>
					Przejdź do sklepu
				</a>

				<div class="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
					<p
						id="nova-favorites-product-count"
						class="text-sm text-nova-muted"
						hidden
						role="status"
						aria-live="polite"
						aria-atomic="true"
					></p>
					<button
						id="nova-favorites-clear"
						type="button"
						aria-haspopup="dialog"
						aria-controls="nova-favorites-clear-dialog"
						hidden
						class="text-sm font-medium text-nova-ink underline underline-offset-4 transition hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink disabled:cursor-wait disabled:opacity-60"
					>
						Wyczyść ulubione
					</button>
				</div>

				<dialog
					id="nova-favorites-clear-dialog"
					role="dialog"
					aria-modal="true"
					aria-labelledby="nova-favorites-clear-title"
					aria-describedby="nova-favorites-clear-description"
					class="m-auto w-[calc(100%-2rem)] max-w-lg border-0 bg-nova-background p-0 text-nova-text shadow-2xl backdrop:bg-nova-ink/60"
				>
					<div class="p-6 sm:p-8">
						<h2
							id="nova-favorites-clear-title"
							class="font-serif text-2xl text-nova-ink"
						>
							Wyczyścić ulubione?
						</h2>
						<p
							id="nova-favorites-clear-description"
							class="mt-4 text-sm leading-relaxed text-nova-muted"
						>Czy na pewno chcesz usunąć wszystkie ulubione produkty?</p>
						<p
							id="nova-favorites-clear-error"
							class="mt-4 text-sm text-red-700"
							role="status"
							aria-live="polite"
							aria-atomic="true"
							hidden
						></p>
						<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<button
								id="nova-favorites-clear-cancel"
								type="button"
								autofocus
								class="border border-nova-line px-5 py-3 text-sm font-medium text-nova-ink transition hover:bg-nova-line/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink disabled:cursor-wait disabled:opacity-60"
							>
								Anuluj
							</button>
							<button
								id="nova-favorites-clear-confirm"
								type="button"
								class="bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink disabled:cursor-wait disabled:opacity-60"
							>
								Usuń wszystkie
							</button>
						</div>
					</div>
				</dialog>

				<div
					id="nova-favorites-grid"
					class="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4"
				></div>
			</div>
		</section>
	@endwhile
@endsection
