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

                <x-project-card />
            
            @endwhile
        </div>

        @php(wp_reset_postdata())
        @endif

  </div>
</section>