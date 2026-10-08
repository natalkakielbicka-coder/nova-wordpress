import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

export const initProjectsLayout = () => {
	const sections = document.querySelectorAll('.wp-block-nova-projects');

	sections.forEach((section) => {
		const grid = section.querySelector('.nova-projects-grid');
		const buttons = section.querySelectorAll('.nova-layout-button');

		if (!grid || !buttons.length) {
			return;
		}

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const layout = button.dataset.layout;
				const isList = layout === 'list';

				if (grid.classList.contains('is-list') === isList) {
					return;
				}

				const cards = grid.querySelectorAll('.nova-project-card');

				// Zapamiętujemy pozycje kart przed zmianą.
				const state = Flip.getState(cards);

				// Zmieniamy układ.
				grid.classList.toggle('is-list', isList);

				// Aktualizujemy aktywny przycisk.
				buttons.forEach((item) => {
					const isActive = item === button;

					item.classList.toggle('is-active', isActive);
					item.setAttribute('aria-pressed', String(isActive));
				});

				// Obsługa ograniczonych animacji.
				if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					ScrollTrigger.refresh();
					return;
				}

				// Animacja przejścia między układami.
				Flip.from(state, {
					duration: 0.65,
					ease: 'sine.inOut',
					absolute: false,
					simple: true,
					onComplete: () => ScrollTrigger.refresh(),
				});
			});
		});
	});
};
