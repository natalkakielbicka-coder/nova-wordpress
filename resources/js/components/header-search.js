export const initHeaderSearch = () => {
	const toggle = document.querySelector('#nova-search-toggle');
	const panel = document.querySelector('#nova-search-panel');
	const input = document.querySelector('#nova-live-search-input');

	if (!toggle || !panel || !input) {
		return;
	}

	const setOpen = (isOpen) => {
		panel.classList.toggle('hidden', !isOpen);

		toggle.setAttribute('aria-expanded', String(isOpen));
		toggle.setAttribute('aria-label', isOpen ? 'Zamknij wyszukiwarkę' : 'Otwórz wyszukiwarkę');

		if (isOpen) {
			input.focus();
		} else {
			toggle.focus();
		}
	};

	toggle.addEventListener('click', () => {
		const isOpen = toggle.getAttribute('aria-expanded') === 'true';

		setOpen(!isOpen);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
			setOpen(false);
		}
	});
};
