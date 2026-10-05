import domReady from '@wordpress/dom-ready';
import { registerBlockStyle } from '@wordpress/blocks';
import '../blocks/nova-cta';
import '../blocks/nova-projects';
import '../blocks/nova-hero';
import '../blocks/nova-content';
import '../blocks/nova-accordion';

domReady(() => {
	registerBlockStyle('core/button', {
		name: 'nova-arrow',
		label: 'NOVA Arrow',
	});
});
