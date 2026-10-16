const initializedTabs = new WeakMap();

const getOwnedElements = (container, selector) =>
	Array.from(container.querySelectorAll(selector)).filter(
		(element) => element.closest('[data-nova-tabs]') === container,
	);

export const initNovaTabs = () => {
	const cleanups = [];
	const containers = document.querySelectorAll('[data-nova-tabs]');

	containers.forEach((container) => {
		if (initializedTabs.has(container)) {
			return;
		}

		const triggers = getOwnedElements(container, '[data-nova-tab-trigger]');
		const panels = getOwnedElements(container, '[data-nova-tab-panel]');
		const tabList = triggers[0]?.closest('nav');

		if (
			!triggers.length ||
			triggers.length !== panels.length ||
			!tabList ||
			tabList.closest('[data-nova-tabs]') !== container ||
			triggers.some((trigger) => trigger.closest('nav') !== tabList)
		) {
			return;
		}

		const panelsById = new Map();
		panels.forEach((panel) => {
			if (!panel.id || panelsById.has(panel.id)) {
				return;
			}

			panelsById.set(panel.id, panel);
		});

		if (panelsById.size !== panels.length) {
			return;
		}

		const panelByTrigger = new Map();
		const linkedPanels = new Set();
		const triggerIds = new Set();

		for (const trigger of triggers) {
			const triggerId = trigger.id;
			const panelId = trigger.getAttribute('aria-controls');
			const panel = panelId ? panelsById.get(panelId) : null;

			if (
				!triggerId ||
				triggerIds.has(triggerId) ||
				!panel ||
				panel.getAttribute('aria-labelledby') !== triggerId ||
				linkedPanels.has(panel)
			) {
				return;
			}

			triggerIds.add(triggerId);
			linkedPanels.add(panel);
			panelByTrigger.set(trigger, panel);
		}

		if (linkedPanels.size !== panels.length) {
			return;
		}

		const activate = (activeTrigger) => {
			triggers.forEach((trigger) => {
				const isActive = trigger === activeTrigger;
				trigger.setAttribute('aria-selected', String(isActive));
				trigger.tabIndex = isActive ? 0 : -1;
				panelByTrigger.get(trigger).hidden = !isActive;
			});
		};

		const handleClick = (event) => {
			const trigger = event.currentTarget;
			if (trigger && panelByTrigger.has(trigger)) {
				trigger.focus();
				activate(trigger);
			}
		};

		const handleFocus = (event) => {
			const trigger = event.target;
			if (panelByTrigger.has(trigger)) {
				activate(trigger);
			}
		};

		const handleKeydown = (event) => {
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
				return;
			}

			const currentIndex = triggers.indexOf(event.target);
			if (currentIndex === -1) {
				return;
			}

			let nextIndex;
			switch (event.key) {
				case 'ArrowRight':
					nextIndex = (currentIndex + 1) % triggers.length;
					break;
				case 'ArrowLeft':
					nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = triggers.length - 1;
					break;
				default:
					return;
			}

			event.preventDefault();
			triggers[nextIndex].focus();
		};

		tabList.setAttribute('role', 'tablist');
		triggers.forEach((trigger) => {
			trigger.setAttribute('role', 'tab');
			trigger.addEventListener('click', handleClick);
			trigger.addEventListener('focus', handleFocus);
		});
		tabList.addEventListener('keydown', handleKeydown);
		panels.forEach((panel) => {
			panel.setAttribute('role', 'tabpanel');
			panel.tabIndex = 0;
		});

		activate(triggers[0]);
		tabList.hidden = false;

		const cleanup = () => {
			triggers.forEach((trigger) => {
				trigger.removeEventListener('click', handleClick);
				trigger.removeEventListener('focus', handleFocus);
				trigger.removeAttribute('role');
				trigger.removeAttribute('aria-selected');
				trigger.removeAttribute('tabindex');
			});
			tabList.removeEventListener('keydown', handleKeydown);
			tabList.removeAttribute('role');
			tabList.hidden = true;
			panels.forEach((panel) => {
				panel.hidden = false;
				panel.removeAttribute('role');
				panel.removeAttribute('tabindex');
			});
			initializedTabs.delete(container);
		};

		initializedTabs.set(container, cleanup);
		cleanups.push(cleanup);
	});

	return () => {
		cleanups.forEach((cleanup) => cleanup());
	};
};
