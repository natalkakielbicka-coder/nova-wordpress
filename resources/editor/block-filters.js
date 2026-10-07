import { addFilter } from '@wordpress/hooks';

addFilter('blocks.registerBlockType', 'nova/limit-heading-levels', (settings, name) => {
	if (name !== 'core/heading') {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			levelOptions: {
				type: 'array',
				default: [2, 3, 4, 5, 6],
			},
		},
	};
});
