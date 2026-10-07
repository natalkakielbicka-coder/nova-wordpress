<?php

namespace App;

use Illuminate\Support\Facades\Vite;

add_action('admin_menu', function () {
	add_menu_page(
		__('NOVA Projects', 'nova-wordpress'),
		__('NOVA Projects', 'nova-wordpress'),
		'edit_posts',
		'nova-projects',
		function () {
			?>
			<div class="wrap">
				<div id="nova-projects-admin"></div>
			</div>
			<?php
		},
		'dashicons-portfolio',
		25
	);
});

add_action('admin_enqueue_scripts', function ($hook) {
	if ($hook !== 'toplevel_page_nova-projects') {
		return;
	}

	echo Vite::withEntryPoints([
		'resources/js/admin-projects.jsx',
	])->toHtml();
});