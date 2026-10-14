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
				const markers = timeline.querySelectorAll('[data-nova-timeline-marker]');
				const updateMarkers = (progress) => {
					const lineTop = line.getBoundingClientRect().top;
					const lineTip = lineTop + line.offsetHeight * progress;

					markers.forEach((marker) => {
						const markerRect = marker.getBoundingClientRect();
						const markerCenter = markerRect.top + markerRect.height / 2;

						marker.dataset.active = markerCenter <= lineTip ? 'true' : 'false';
					});
				};

				markers.forEach((marker) => {
					marker.dataset.active = 'false';
				});

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
							onUpdate: (self) => updateMarkers(self.progress),
							onRefresh: (self) => updateMarkers(self.progress),
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
		timelines.forEach((timeline) => {
			timeline.querySelectorAll('[data-nova-timeline-marker]').forEach((marker) => {
				marker.dataset.active = 'false';
			});
		});
	};
};
