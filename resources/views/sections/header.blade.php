<header class="border-b border-nova-line bg-nova-background">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
    <a
      class="text-xl font-semibold tracking-tight text-nova-ink"
      href="{{ home_url('/') }}"
    >
      {!! $siteName !!}
    </a>

    @if (has_nav_menu('primary_navigation'))
      <nav
        class="nav-primary"
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

    <a
      href="#kontakt"
      class="bg-nova-ink px-5 py-3 text-sm font-medium text-nova-white transition hover:opacity-80"
    >
      Porozmawiajmy
    </a>
  </div>
</header>