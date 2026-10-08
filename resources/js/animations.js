import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

const initHeroAnimation = () => {
	const hero = document.querySelector('.nova-hero');

	if (!hero) {
		return;
	}

	const textElements = hero.querySelectorAll(
		'.nova-hero__eyebrow, .nova-hero__title, .nova-hero__text',
	);

	const button = hero.querySelector('.nova-hero__buttons');
	const image = hero.querySelector('.nova-hero__image');

	const timeline = gsap.timeline({
		defaults: {
			duration: 0.8,
			ease: 'power3.out',
		},
	});

	if (textElements.length) {
		timeline.from(textElements, {
			y: 30,
			autoAlpha: 0,
			stagger: 0.12,
		});
	}

	if (button) {
		gsap.fromTo(
			button,
			{
				y: 30,
				autoAlpha: 0,
			},
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.8,
				delay: 0.5,
				ease: 'power3.out',
				immediateRender: false,
			},
		);
	}

	if (image) {
		timeline.from(
			image,
			{
				x: 50,
				autoAlpha: 0,
				duration: 1.1,
			},
			0.2,
		);
	}
};

const initProjectsAnimation = () => {
	const projects = gsap.utils.toArray('.nova-project-card');

	if (!projects.length) {
		return;
	}

	projects.forEach((project, index) => {
		gsap.fromTo(
			project,
			{
				y: 40,
				autoAlpha: 0,
			},
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.8,
				delay: index * 0.12,
				ease: 'power3.out',
				immediateRender: false,
				scrollTrigger: {
					trigger: project,
					start: 'top 90%',
					once: true,
				},
			},
		);
	});
};

const initProjectsLayout = () => {
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

				// Zapamiętujemy aktualne pozycje i rozmiary kart.
				const state = Flip.getState(cards);

				// Zmieniamy układ.
				grid.classList.toggle('is-list', isList);

				// Aktualizujemy stan przycisków.
				buttons.forEach((item) => {
					const isActive = item === button;

					item.classList.toggle('is-active', isActive);
					item.setAttribute('aria-pressed', String(isActive));
				});

				// Animujemy przejście do nowego układu.
				if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					return;
				}

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

const initPinnedSection = () => {
	const section = document.querySelector('.nova-pin-section');

	if (!section) {
		return;
	}

	const steps = gsap.utils.toArray(section.querySelectorAll('.nova-process-step'));

	if (steps.length !== 3) {
		return;
	}

	const mm = gsap.matchMedia();

	mm.add('(min-width: 1024px) and (min-height: 750px)', () => {
		if (section.offsetHeight > window.innerHeight) {
			return;
		}

		const setActiveStep = (activeIndex) => {
			steps.forEach((step, index) => {
				step.classList.toggle('is-active', index === activeIndex);
			});
		};

		gsap.set(steps, {
			opacity: 0.3,
		});

		gsap.set(steps[0], {
			opacity: 1,
		});

		setActiveStep(0);

		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				end: '+=900',
				pin: true,
				pinSpacing: true,
				scrub: 1,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const activeIndex = Math.min(Math.floor(self.progress * 3), 2);

					setActiveStep(activeIndex);
				},
			},
		});

		timeline
			.to(steps[0], {
				opacity: 0.3,
				duration: 1,
			})
			.to(
				steps[1],
				{
					opacity: 1,
					duration: 1,
				},
				'<',
			)
			.to(steps[1], {
				opacity: 0.3,
				duration: 1,
			})
			.to(
				steps[2],
				{
					opacity: 1,
					duration: 1,
				},
				'<',
			);

		return () => {
			timeline.kill();

			steps.forEach((step) => {
				step.classList.remove('is-active');
			});

			gsap.set(steps, {
				clearProps: 'opacity',
			});
		};
	});
};

export const initAnimations = () => {
	// Obsługa przełącznika musi działać również bez animacji.
	initProjectsLayout();

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	initHeroAnimation();
	initProjectsAnimation();
	initPinnedSection();
};
