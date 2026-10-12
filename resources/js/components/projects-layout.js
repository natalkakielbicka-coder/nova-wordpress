import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

const initializedSections = new WeakMap();

export const initProjectsLayout = () => {
	const sections = document.querySelectorAll('.wp-block-nova-projects');
	const cleanups = [];

	sections.forEach((section) => {
		if (initializedSections.has(section)) {
			return;
		}

		const grid = section.querySelector('.nova-projects-grid');
		const buttons = section.querySelectorAll('.nova-layout-button');

		if (!grid || !buttons.length) {
			return;
		}

		let flipAnimation;

		const handleLayoutClick = (event) => {
			const button = event.currentTarget;
			const layout = button.dataset.layout;
			const isList = layout === 'list';

			if (grid.classList.contains('is-list') === isList) {
				return;
			}

			const flipTargets = grid.querySelectorAll(
				'.nova-project-card, .nova-project-card__image, .nova-project-card__content',
			);

			// Zapamiętujemy pozycje kart przed zmianą.
			const state = Flip.getState(flipTargets);

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
			let animation;
			animation = Flip.from(state, {
				duration: 0.65,
				ease: 'sine.inOut',
				absolute: false,
				simple: true,
				nested: true,
				onComplete: () => {
					ScrollTrigger.refresh();

					if (flipAnimation === animation) {
						flipAnimation = null;
					}
				},
			});
			flipAnimation = animation;
		};

		buttons.forEach((button) => {
			button.addEventListener('click', handleLayoutClick);
		});

		const cleanupSection = () => {
			if (initializedSections.get(section) !== cleanupSection) {
				return;
			}

			buttons.forEach((button) => {
				button.removeEventListener('click', handleLayoutClick);
			});

			if (flipAnimation) {
				const animation = flipAnimation;
				flipAnimation = null;
				animation.progress(1);
			}

			initializedSections.delete(section);
		};

		initializedSections.set(section, cleanupSection);
		cleanups.push(cleanupSection);
	});

	let isCleanedUp = false;

	return () => {
		if (isCleanedUp) {
			return;
		}

		isCleanedUp = true;
		cleanups.forEach((cleanup) => cleanup());
	};
};
