import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initPinnedSection = () => {
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
