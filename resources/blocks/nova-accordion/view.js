import { getContext, store } from '@wordpress/interactivity';

const { state } = store('nova/accordion', {
	state: {
		openItem: null,
	},

	actions: {
		toggle() {
			const context = getContext();

			if (!context.singleOpen) {
				context.isOpen = !context.isOpen;
				return;
			}

			state.openItem = state.openItem === context.index ? null : context.index;
		},
	},

	callbacks: {
		syncOpenState() {
			const context = getContext();

			if (!context.singleOpen) {
				return;
			}

			if (state.openItem === null && context.isOpen && context.index === 0) {
				state.openItem = 0;
			}

			context.isOpen = state.openItem === context.index;
		},
	},
});
