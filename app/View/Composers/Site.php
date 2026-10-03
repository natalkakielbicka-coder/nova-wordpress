<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class Site extends Composer
{
	protected static $views = [
		'*',
	];

	public function with()
	{
		return [
			'contactEmail' => get_field('contact_email', 'option'),
			'contactPhone' => get_field('contact_phone', 'option'),
			'instagramUrl' => get_field('instagram_url', 'option'),
			'linkedinUrl' => get_field('linkedin_url', 'option'),
		];
	}
}