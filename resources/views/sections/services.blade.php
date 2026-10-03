@php
  $services = [
    [
      'title' => 'Strony WWW',
      'description' => 'Nowoczesne, responsywne strony na WordPress.',
      'icon' => 'website',
    ],
    [
      'title' => 'Sklepy online',
      'description' => 'WooCommerce, integracje i automatyzacje.',
      'icon' => 'shop',
    ],
    [
      'title' => 'Wsparcie techniczne',
      'description' => 'Aktualizacje, rozwój i opieka nad stroną.',
      'icon' => 'support',
    ],
  ];
@endphp

<section class="bg-nova-background px-6 py-20 lg:py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-16 max-w-2xl">
      <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
        Usługi
      </p>

      <h2 class="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl">
        Co mogę dla Ciebie zrobić?
      </h2>
    </div>

    <div class="grid gap-10 md:grid-cols-3 md:gap-16">
      @foreach ($services as $service)
        <article>
          <div class="mb-5 flex size-10 items-center justify-center bg-nova-white">
            @if ($service['icon'] === 'website')
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="13" rx="1" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            @elseif ($service['icon'] === 'shop')
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            @else
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.3 2.3-3-3z" />
              </svg>
            @endif
          </div>

          <h3 class="font-serif text-xl text-nova-ink">
            {{ $service['title'] }}
          </h3>

          <p class="mt-2 max-w-xs text-sm leading-6 text-nova-muted">
            {{ $service['description'] }}
          </p>
        </article>
      @endforeach
    </div>
  </div>
</section>