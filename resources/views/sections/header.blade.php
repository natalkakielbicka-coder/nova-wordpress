<header class="border-b border-nova-line bg-nova-background">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
		<a class="text-xl font-semibold tracking-tight text-nova-ink" href="{{ home_url('/') }}">
			{!! $siteName !!}
		</a>

		@if (has_nav_menu('primary_navigation'))
			<nav
				class="nav-primary hidden lg:block"
				aria-label="{{ wp_get_nav_menu_name('primary_navigation') }}"
			>
				{!! wp_nav_menu([
					'theme_location' => 'primary_navigation',
					'menu_class' => 'flex items-center gap-8',
					'container' => false,
					'echo' => false,
				]) !!}
			</nav>
		@endif

		<div class="relative z-20 ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
			<button
				type="button"
				id="nova-theme-toggle"
				class="relative z-20 flex size-11 shrink-0 cursor-pointer items-center justify-center text-nova-ink transition hover:opacity-60"
				aria-label="Włącz ciemny motyw"
				aria-pressed="false"
			>
				<!-- Księżyc – motyw jasny -->
				<svg
					class="nova-theme-icon-moon"
					xmlns="http://www.w3.org/2000/svg"
					width="21"
					height="21"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M20.985 12.486A9 9 0 0 1 11.514 3.015 9 9 0 1 0 20.985 12.486Z" />
				</svg>

				<!-- Słońce – motyw ciemny -->
				<svg
					class="nova-theme-icon-sun hidden"
					xmlns="http://www.w3.org/2000/svg"
					width="21"
					height="21"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
				</svg>
			</button>

			<button
				type="button"
				id="nova-search-toggle"
				class="flex size-11 shrink-0 cursor-pointer items-center justify-center text-nova-ink transition hover:opacity-60"
				aria-label="Otwórz wyszukiwarkę"
				aria-expanded="false"
				aria-controls="nova-search-panel"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
				</svg>
			</button>
		</div>

		<button
			type="button"
			class="mobile-menu-toggle flex size-11 items-center justify-center lg:hidden"
			aria-expanded="false"
			aria-controls="mobile-navigation"
			aria-label="Otwórz menu"
		>
			<span class="flex w-6 flex-col gap-1.5" aria-hidden="true">
				<span class="relative block size-6" aria-hidden="true">
					<span
						class="mobile-menu-line-1 absolute left-0 top-1/2 block h-px w-full -translate-y-[7px] bg-nova-ink transition-transform duration-300"
					></span>

					<span
						class="mobile-menu-line-2 absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-nova-ink transition-opacity duration-300"
					></span>

					<span
						class="mobile-menu-line-3 absolute left-0 top-1/2 block h-px w-full translate-y-[6px] bg-nova-ink transition-transform duration-300"
					></span>
				</span>
			</span>
		</button>

		<a
			href="#kontakt"
			class="hidden bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white transition hover:opacity-80 lg:inline-flex"
		>
			Porozmawiajmy
		</a>
	</div>

	<div
		id="nova-search-panel"
		class="hidden border-t border-nova-line bg-nova-background px-6 py-8"
	>
		<div class="mx-auto max-w-3xl">
			<form
				id="nova-live-search-form"
				role="search"
				action="{{ home_url('/') }}"
				method="get"
			>
				<label
					for="nova-live-search-input"
					class="mb-3 block text-sm font-medium text-nova-ink"
				>
					Czego szukasz?
				</label>

				<div class="relative">
					<input
						id="nova-live-search-input"
						type="search"
						name="s"
						placeholder="Wpisz szukaną frazę..."
						autocomplete="off"
						aria-controls="nova-live-search-results"
						aria-expanded="false"
						class="w-full border-b border-nova-ink bg-transparent py-4 pr-12 text-lg text-nova-ink outline-none placeholder:text-nova-muted"
					/>
				</div>
			</form>

			<div
				id="nova-live-search-results"
				class="mt-6"
				aria-live="polite"
				aria-relevant="additions text"
			></div>
		</div>
	</div>

	@if (has_nav_menu('primary_navigation'))
		<nav
			id="mobile-navigation"
			class="mobile-navigation hidden border-t border-nova-line px-6 py-6 lg:hidden"
			aria-label="Nawigacja mobilna"
		>
			<div class="mx-auto max-w-7xl">
				{!! wp_nav_menu([
					'theme_location' => 'primary_navigation',
					'menu_class' => 'flex flex-col gap-5 text-lg',
					'container' => false,
					'echo' => false,
				]) !!}

				<a
					href="#kontakt"
					class="mt-8 inline-flex bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white"
				>
					Porozmawiajmy
				</a>
			</div>
		</nav>
	@endif
</header>
