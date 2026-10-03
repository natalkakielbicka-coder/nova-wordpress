export const initMobileMenu = () => {
	const toggle = document.querySelector('.mobile-menu-toggle');
	const navigation = document.querySelector('.mobile-navigation');

	if (!toggle || !navigation) {
		return;
	}

	const line1 = toggle.querySelector('.mobile-menu-line-1');
	const line2 = toggle.querySelector('.mobile-menu-line-2');
	const line3 = toggle.querySelector('.mobile-menu-line-3');

	const setMenuState = (isOpen) => {
		toggle.setAttribute('aria-expanded', String(isOpen));
		toggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');

		navigation.classList.toggle('hidden', !isOpen);

		line1?.classList.toggle('!translate-y-0', isOpen);
		line1?.classList.toggle('rotate-45', isOpen);

		line2?.classList.toggle('opacity-0', isOpen);

		line3?.classList.toggle('!translate-y-0', isOpen);
		line3?.classList.toggle('-rotate-45', isOpen);
	};

	toggle.addEventListener('click', () => {
		const isOpen = toggle.getAttribute('aria-expanded') === 'true';

		setMenuState(!isOpen);
	});

	navigation.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			setMenuState(false);
		});
	});
};
