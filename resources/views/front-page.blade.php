@extends ('layouts.app')

@section ('content')
	<main>
		@include ('sections.hero')
		@include ('sections.services')
		@include ('sections.projects')
		@include ('sections.testimonials')
		@include ('sections.contact-cta')
	</main>
@endsection
