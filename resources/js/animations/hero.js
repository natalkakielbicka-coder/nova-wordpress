import gsap from 'gsap';

export const initHeroAnimation = () => {
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
