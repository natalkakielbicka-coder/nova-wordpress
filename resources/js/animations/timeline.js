import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initTimelineAnimation = ({ skipEntranceAnimations = false } = {}) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return () => {};
	}

	const timelines = gsap.utils.toArray('[data-nova-timeline]');

	if (!timelines.length) {
		return () => {};
	}

	const ctx = gsap.context(() => {
		timelines.forEach((timeline) => {
			const line = timeline.querySelector('[data-nova-timeline-line]');

			if (line) {
				gsap.fromTo(
					line,
					{ scaleY: 0 },
					{
						scaleY: 1,
						ease: 'none',
						scrollTrigger: {
							trigger: timeline,
							start: 'top 85%',
							end: 'bottom 15%',
							scrub: true,
						},
					},
				);
			}

			if (!skipEntranceAnimations) {
				const items = timeline.querySelectorAll('[data-nova-timeline-item]');

				items.forEach((item) => {
					gsap.from(item, {
						opacity: 0,
						y: 30,
						duration: 0.6,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: item,
							start: 'top 85%',
							once: true,
						},
					});
				});
			}
		});
	});

	let isCleanedUp = false;

	return () => {
		if (isCleanedUp) {
			return;
		}

		isCleanedUp = true;
		ctx.revert();
	};
};
