import { createBlock, registerBlockType, registerBlockVariation } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import save from './save';

registerBlockType(metadata.name, {
	...metadata,

	transforms: {
		from: [
			{
				type: 'block',
				blocks: ['core/group'],
				transform: (attributes, innerBlocks) => {
					return createBlock(metadata.name, {}, innerBlocks);
				},
			},
		],
	},

	edit: Edit,
	save,
});

registerBlockVariation('nova/content', {
	name: 'narrow',
	title: 'NOVA Content — Narrow',
	description: 'Wąska sekcja treści do tekstów i artykułów.',
	attributes: {
		width: 'narrow',
	},
	isActive: (blockAttributes) => blockAttributes.width === 'narrow',
	scope: ['inserter'],
});

registerBlockVariation('nova/content', {
	name: 'wide',
	title: 'NOVA Content — Wide',
	description: 'Szeroka sekcja treści do bardziej rozbudowanych układów.',
	attributes: {
		width: 'wide',
	},
	isActive: (blockAttributes) => blockAttributes.width === 'wide',
	scope: ['inserter'],
});
