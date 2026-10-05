import { createBlock, registerBlockType } from '@wordpress/blocks';

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
