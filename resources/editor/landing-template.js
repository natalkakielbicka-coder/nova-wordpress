import domReady from '@wordpress/dom-ready';
import { select, subscribe, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

domReady(() => {
	let previousTemplate = select('core/editor').getEditedPostAttribute('template');

	subscribe(() => {
		const editor = select('core/editor');
		const currentTemplate = editor.getEditedPostAttribute('template');

		if (currentTemplate === previousTemplate) {
			return;
		}

		previousTemplate = currentTemplate;

		if (currentTemplate !== 'template-landing.blade.php') {
			return;
		}

		const blocks = select('core/block-editor').getBlocks();

		const isEmpty =
			blocks.length === 0 ||
			(blocks.length === 1 &&
				blocks[0].name === 'core/paragraph' &&
				!blocks[0].attributes.content);

		if (!isEmpty) {
			return;
		}

		dispatch('core/block-editor').resetBlocks([
			createBlock('nova/hero'),
			createBlock('nova/content'),
			createBlock('nova/projects'),
			createBlock('nova/cta'),
		]);
	});
});
