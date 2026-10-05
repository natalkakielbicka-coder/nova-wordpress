<?php
/**
 * Title: NOVA Projects
 * Slug: nova-wordpress/projects
 * Categories: featured
 * Description: Sekcja projektów oparta na natywnym Query Loop.
 */
?>

<!-- wp:query {"query":{"perPage":6,"pages":0,"offset":0,"postType":"project","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"nova-projects-query mx-auto max-w-7xl px-6"} -->
<div class="wp-block-query nova-projects-query mx-auto max-w-7xl px-6">

	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

		<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->

        <!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"nova/project-field","args":{"key":"project_client"}}}},"className":"nova-projects-query__client"} -->
        <p class="nova-projects-query__client">Klient</p>
        <!-- /wp:paragraph -->

		<!-- wp:post-title {"level":3,"isLink":true} /-->

		<!-- wp:post-excerpt /-->

	<!-- /wp:post-template -->

	<!-- wp:query-pagination -->
		<!-- wp:query-pagination-previous /-->

		<!-- wp:query-pagination-numbers /-->

		<!-- wp:query-pagination-next /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:paragraph -->
		<p>Nie znaleziono żadnych projektów.</p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->

</div>
<!-- /wp:query -->