{{--
  Template Name: NOVA Landing Page
--}}

@extends ('layouts.app')

@section ('content')
	@while (have_posts())
		@php (the_post())

		<article @php (post_class())>{!! the_content() !!}</article>
	@endwhile
@endsection
