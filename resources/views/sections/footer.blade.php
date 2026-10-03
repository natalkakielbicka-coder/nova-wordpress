<footer class="border-t border-nova-line bg-nova-background px-6">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-2">
				<a
					href="{{ home_url('/') }}"
					class="text-xl font-semibold tracking-tight text-nova-ink"
				>
					{!! $siteName !!}
				</a>

				<p class="mt-5 max-w-sm text-sm leading-6 text-nova-muted">Projektuję i tworzę nowoczesne strony WordPress, które łączą estetykę, funkcjonalność i łatwą obsługę.</p>
			</div>

			<div>
				<p class="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-nova-muted">Nawigacja</p>

				@if (has_nav_menu('primary_navigation'))
					{!! wp_nav_menu([
						'theme_location' => 'primary_navigation',
						'menu_class' => 'flex flex-col items-start gap-3 text-sm',
						'container' => false,
						'echo' => false,
					]) !!}
				@endif
			</div>

			<div>
				<p class="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-nova-muted">Kontakt</p>

				<div class="flex flex-col items-start gap-3">
					@if ($contactEmail)
						<a
							href="mailto:{{ $contactEmail }}"
							class="text-sm text-nova-ink transition hover:opacity-60"
						>
							{{ $contactEmail }}
						</a>
					@endif

					@if ($contactPhone)
						<a
							href="tel:{{ preg_replace('/\s+/', '', $contactPhone) }}"
							class="text-sm text-nova-ink transition hover:opacity-60"
						>
							{{ $contactPhone }}
						</a>
					@endif

					@if ($instagramUrl)
						<a
							href="{{ $instagramUrl }}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-nova-muted transition hover:text-nova-ink"
						>
							Instagram ↗
						</a>
					@endif

					@if ($linkedinUrl)
						<a
							href="{{ $linkedinUrl }}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-nova-muted transition hover:text-nova-ink"
						>
							LinkedIn ↗
						</a>
					@endif
				</div>
			</div>
		</div>

		<div
			class="flex flex-col gap-3 border-t border-nova-line py-6 text-xs text-nova-muted sm:flex-row sm:items-center sm:justify-between"
		>
			<p>&copy; {{ date('Y') }} {!! $siteName !!}. Wszystkie prawa zastrzeżone.</p>

			<p>WordPress • Sage • Tailwind CSS</p>
		</div>
	</div>
</footer>
