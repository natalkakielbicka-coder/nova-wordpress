@php
	$email = get_field('contact_email', 'option');
@endphp

<section id="kontakt" class="bg-nova-ink px-6 py-24 text-nova-white lg:py-32">
	<div class="mx-auto max-w-7xl">
		<div class="grid items-end gap-10 lg:grid-cols-[2fr_1fr]">
			<div>
				<p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] opacity-60">Porozmawiajmy</p>

				<h2
					class="max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
				>
					Masz pomysł na stronę?
				</h2>

				<p class="mt-7 max-w-xl text-base leading-7 opacity-70">Opowiedz mi o swoim projekcie. Pomogę dobrać rozwiązanie i stworzyć stronę, która będzie dobrze wyglądać i wspierać Twój biznes.</p>
			</div>

			<div class="lg:flex lg:justify-end">
				@if ($email)
					<a
						href="mailto:{{ $email }}"
						class="inline-flex items-center gap-4 border-b border-nova-white pb-2 text-lg transition hover:opacity-60"
					>
						Napisz do mnie
						<span aria-hidden="true">→</span>
					</a>
				@endif
			</div>
		</div>
	</div>
</section>
