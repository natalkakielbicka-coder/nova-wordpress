import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initHeroAnimation = () => {
	const hero = document.querySelector('.nova-hero');

	if (!hero) {
		return;
	}

	const textElements = hero.querySelectorAll(
		'.nova-hero__eyebrow, .nova-hero__title, .nova-hero__text',
	);

	const button = hero.querySelectorAll('.nova-hero__buttons');
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

export const initAnimations = () => {
	console.log('NOVA: initAnimations uruchomione');

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		console.log('NOVA: animacje wyłączone przez reduced motion');
		return;
	}

	initHeroAnimation();
	initProjectsAnimation();
};
