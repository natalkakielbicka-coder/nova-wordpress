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
