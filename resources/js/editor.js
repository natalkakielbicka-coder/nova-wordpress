import domReady from '@wordpress/dom-ready';
import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';
import '../formats/nova-highlight';
import '../blocks/nova-cta';
import '../blocks/nova-projects';
import '../blocks/nova-hero';
import '../blocks/nova-content';
import '../blocks/nova-accordion';
import '../blocks/nova-project-meta';
import '../blocks/nova-project-meta-item';
import '../editor/nova-sidebar';

domReady(() => {
	registerBlockStyle('core/button', {
		name: 'nova-arrow',
		label: 'NOVA Arrow',
	});

	registerBlockVariation('core/query', {
		name: 'nova-projects',
		title: 'NOVA Projects',
		description: 'Siatka projektów NOVA.',
		attributes: {
			query: {
				perPage: 6,
				pages: 0,
				offset: 0,
				postType: 'project',
				order: 'desc',
				orderBy: 'date',
				inherit: false,
			},
			className: 'nova-projects-query',
		},
		innerBlocks: [
			[
				'core/post-template',
				{
					layout: {
						type: 'grid',
						columnCount: 3,
					},
				},
				[
					[
						'core/post-featured-image',
						{
							isLink: true,
							aspectRatio: '4/3',
						},
					],
					[
						'core/paragraph',
						{
							metadata: {
								bindings: {
									content: {
										source: 'nova/project-field',
										args: {
											key: 'project_client',
										},
									},
								},
							},
							className: 'nova-projects-query__client',
							content: 'Klient',
						},
					],
					[
						'core/post-title',
						{
							level: 3,
							isLink: true,
						},
					],
					['core/post-excerpt'],
				],
			],
			[
				'core/query-pagination',
				{},
				[
					['core/query-pagination-previous'],
					['core/query-pagination-numbers'],
					['core/query-pagination-next'],
				],
			],
			[
				'core/query-no-results',
				{},
				[
					[
						'core/paragraph',
						{
							content: 'Nie znaleziono żadnych projektów.',
						},
					],
				],
			],
		],
		scope: ['inserter'],
	});
});
