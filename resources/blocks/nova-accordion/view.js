import { getContext, store } from '@wordpress/interactivity';

const { state } = store('nova/accordion', {
	state: {
		openItems: {},
	},

	actions: {
		toggle() {
			const context = getContext();

			if (!context.singleOpen) {
				context.isOpen = !context.isOpen;
				return;
			}

			const { accordionId, index } = context;
			const currentOpenItem = state.openItems[accordionId];

			state.openItems[accordionId] = currentOpenItem === index ? null : index;
		},
	},

	callbacks: {
		syncOpenState() {
			const context = getContext();

			if (!context.singleOpen) {
				return;
			}

			const { accordionId, index, openFirstItem } = context;

			if (!(accordionId in state.openItems)) {
				state.openItems[accordionId] = openFirstItem ? 0 : null;
			}

			context.isOpen = state.openItems[accordionId] === index;
		},
	},
});
