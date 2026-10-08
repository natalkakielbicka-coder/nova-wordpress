import domReady from '@wordpress/dom-ready';
import { select, subscribe, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

domReady(() => {
	const landingTemplate = 'template-landing.blade.php';

	const getCurrentTemplate = () => select('core/editor').getEditedPostAttribute('template');

	const createLockedBlock = (name) =>
		createBlock(name, {
			lock: {
				move: true,
				remove: true,
			},
		});

	const insertLandingBlocks = () => {
		const blocks = select('core/block-editor').getBlocks();

		const isEmpty =
			blocks.length === 0 ||
			(blocks.length === 1 &&
				blocks[0].name === 'core/paragraph' &&
				!blocks[0].attributes.content);

		if (!isEmpty) {
			return;
		}

		const landingGroup = createBlock(
			'core/group',
			{
				className: 'nova-landing',
				templateLock: 'contentOnly',
				lock: {
					move: true,
					remove: true,
				},
				layout: {
					type: 'default',
				},
			},
			[
				createLockedBlock('nova/hero'),
				createLockedBlock('nova/content'),
				createLockedBlock('nova/projects'),
				createLockedBlock('nova/cta'),
			],
		);

		dispatch('core/block-editor').resetBlocks([landingGroup]);
	};

	let previousTemplate = getCurrentTemplate();

	subscribe(() => {
		const currentTemplate = getCurrentTemplate();

		if (currentTemplate === previousTemplate) {
			return;
		}

		previousTemplate = currentTemplate;

		if (currentTemplate !== landingTemplate) {
			return;
		}

		insertLandingBlocks();
	});
});
