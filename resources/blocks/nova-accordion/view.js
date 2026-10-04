import { getContext, store } from '@wordpress/interactivity';

store('nova/accordion', {
	actions: {
		toggle() {
			const context = getContext();
			context.isOpen = !context.isOpen;
		},
	},
});
