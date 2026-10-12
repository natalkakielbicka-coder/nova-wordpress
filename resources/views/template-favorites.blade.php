{{--
  Template Name: Ulubione produkty
--}}

@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php (the_post())
		@include ('partials.page-header', ['title' => 'Ulubione produkty'])

		<section class="px-6 py-20 lg:py-28">
			<div class="mx-auto max-w-7xl">
				<div
					id="nova-favorites-grid"
					class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
				></div>
			</div>
		</section>
	@endwhile
@endsection
