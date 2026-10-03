@php
  $projects = new WP_Query([
    'post_type' => 'project',
    'post_status' => 'publish',
    'posts_per_page' => 3,
  ]);
@endphp

<section id="projekty" class="bg-nova-white px-6 py-24 lg:py-32">
  <div class="mx-auto max-w-7xl">

    <div class="mb-14 flex items-end justify-between gap-8">
      <div>
        <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
          Portfolio
        </p>

        <h2 class="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl">
          Wybrane projekty
        </h2>
      </div>

      <a
        href="#"
        class="hidden border-b border-nova-ink pb-1 text-sm text-nova-ink md:block"
      >
        Zobacz wszystkie
      </a>
    </div>

    @if ($projects->have_posts())
        <div class="grid gap-10 md:grid-cols-3">
            @while ($projects->have_posts())
            @php($projects->the_post())

            <article>
                <a
                    href="{{ get_permalink() }}"
                    class="group block"
                    aria-label="Zobacz projekt: {{ get_the_title() }}"
                >
                    <div class="aspect-[4/3] overflow-hidden bg-nova-background">
                    @if (has_post_thumbnail())
                        {!! get_the_post_thumbnail(
                        get_the_ID(),
                        'large',
                        [
                            'class' => 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
                        ]
                        ) !!}
                    @endif
                    </div>
                </a>

                <p class="mt-5 text-xs uppercase tracking-[0.15em] text-nova-muted">
                    {{ get_the_excerpt() }}
                </p>

                <h3 class="mt-2 font-serif text-2xl text-nova-ink">
                    <a
                    href="{{ get_permalink() }}"
                    class="transition hover:opacity-60"
                    >
                    {{ get_the_title() }}
                    </a>
                </h3>

                <a
                    href="{{ get_permalink() }}"
                    class="mt-4 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink transition hover:opacity-60"
                >
                    Zobacz projekt
                    <span aria-hidden="true">→</span>
                </a>
                </article>
            @endwhile
        </div>

        @php(wp_reset_postdata())
        @endif

  </div>
</section>