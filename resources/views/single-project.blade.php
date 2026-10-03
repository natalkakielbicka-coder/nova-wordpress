@extends('layouts.app')

@section('content')
  @while (have_posts())
    @php
      the_post();

      $client = get_field('project_client');
      $year = get_field('project_year');
      $scope = get_field('project_scope');
      $technologies = get_field('project_technologies');
    @endphp

    <section class="px-6 py-20 lg:py-28">
      <div class="mx-auto max-w-7xl">

        <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
          Projekt
        </p>

        <h1 class="max-w-4xl font-serif text-5xl leading-tight tracking-tight text-nova-ink md:text-6xl">
          {{ get_the_title() }}
        </h1>

        <div class="mt-16 border-t border-nova-line pt-8">
            <div class="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4">

                @if ($client)
                <div>
                    <p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">
                    Klient
                    </p>

                    <p class="text-base text-nova-ink">
                    {{ $client }}
                    </p>
                </div>
                @endif

                @if ($year)
                <div>
                    <p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">
                    Rok
                    </p>

                    <p class="text-base text-nova-ink">
                    {{ $year }}
                    </p>
                </div>
                @endif

                @if ($scope)
                <div>
                    <p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">
                    Zakres prac
                    </p>

                    <p class="text-base leading-6 text-nova-ink">
                    {{ $scope }}
                    </p>
                </div>
                @endif

                @if ($technologies)
                <div>
                    <p class="mb-3 text-xs uppercase tracking-[0.15em] text-nova-muted">
                    Technologie
                    </p>

                    <p class="text-base leading-6 text-nova-ink">
                    {{ $technologies }}
                    </p>
                </div>
                @endif

            </div>
        </div>

      </div>
    </section>

    @if (has_post_thumbnail())
    <section class="px-6 pb-20 lg:pb-28">
        <div class="mx-auto max-w-7xl">
        <div class="aspect-[16/9] overflow-hidden">
            {!! get_the_post_thumbnail(
            get_the_ID(),
            'full',
            [
                'class' => 'h-full w-full object-cover',
            ]
            ) !!}
        </div>
        </div>
    </section>
    @endif

    <section class="px-6 pb-24 lg:pb-32">
    <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_2fr]">

        <div>
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-nova-muted">
            O projekcie
        </p>
        </div>

        <div class="max-w-3xl">
            <div class="project-content">
            @php(the_content())
            </div>
        </div>

    </div>
    </section>
  @endwhile
@endsection