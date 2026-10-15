import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initTimelineAnimation = ({ skipEntranceAnimations = false } = {}) => {
	const timelines = gsap.utils.toArray('[data-nova-timeline]');

	if (!timelines.length) {
		return () => {};
	}

	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	const ctx = gsap.context(() => {
		timelines.forEach((timeline) => {
			const shouldAnimate =
				timeline.dataset.timelineAnimate !== 'false' && !reducedMotionQuery.matches;
			const line = timeline.querySelector('[data-nova-timeline-line]');
			const markers = timeline.querySelectorAll('[data-nova-timeline-marker]');
			const items = timeline.querySelectorAll('[data-nova-timeline-item]');

			if (!shouldAnimate) {
				if (line) {
					gsap.set(line, { scaleY: 1 });
				}

				markers.forEach((marker) => {
					marker.dataset.active = 'true';
				});

				return;
			}

			if (line) {
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
			const isStatic =
				timeline.dataset.timelineAnimate === 'false' || reducedMotionQuery.matches;

			timeline.querySelectorAll('[data-nova-timeline-marker]').forEach((marker) => {
				marker.dataset.active = isStatic ? 'true' : 'false';
			});
		});
	};
};
