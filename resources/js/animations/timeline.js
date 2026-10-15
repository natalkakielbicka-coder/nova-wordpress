import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const getTimelineLineScrollRange = (timeline) => {
	const maxScroll = ScrollTrigger.maxScroll(window);
	const viewportHeight = window.innerHeight;
	const bounds = timeline.getBoundingClientRect();
	const naturalStart = bounds.top + window.scrollY - viewportHeight * 0.85;
	const naturalEnd = bounds.bottom + window.scrollY - viewportHeight * 0.15;
	const start = Math.min(naturalStart, maxScroll - 1);
	const end = Math.max(start + 1, Math.min(naturalEnd, maxScroll));

	return { start, end };
};

export const initTimelineAnimation = ({ skipEntranceAnimations = false } = {}) => {
	const timelines = gsap.utils.toArray('[data-nova-timeline]');

	if (!timelines.length) {
		return () => {};
	}

	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	let hasAnimatedLines = false;

	const ctx = gsap.context(() => {
		timelines.forEach((timeline) => {
			const shouldAnimate =
				timeline.dataset.timelineAnimate !== 'false' && !reducedMotionQuery.matches;
			const line = timeline.querySelector('[data-nova-timeline-line]');
			const markers = timeline.querySelectorAll('[data-nova-timeline-marker]');
			const stages = Array.from(markers, (marker) => ({
				marker,
				content: marker.closest('li')?.querySelector('[data-nova-timeline-content]'),
			}));
			const items = timeline.querySelectorAll('[data-nova-timeline-item]');

			if (!shouldAnimate) {
				if (line) {
					gsap.set(line, { scaleY: 1 });
				}

				stages.forEach(({ marker, content }) => {
					marker.dataset.active = 'true';
					if (content) {
						content.dataset.active = 'true';
					}
				});

				return;
			}

			if (line) {
				hasAnimatedLines = true;

				const updateMarkers = (progress) => {
					if (progress >= 1) {
						stages.forEach(({ marker, content }) => {
							marker.dataset.active = 'true';
							if (content) {
								content.dataset.active = 'true';
							}
						});
						return;
					}

					const lineTop = line.getBoundingClientRect().top;
					const lineTip = lineTop + line.offsetHeight * progress;

					stages.forEach(({ marker, content }) => {
						const markerBounds = marker.getBoundingClientRect();
						const markerCenter = markerBounds.top + markerBounds.height / 2;
						const isActive = markerCenter <= lineTip;

						marker.dataset.active = isActive ? 'true' : 'false';
						if (content) {
							content.dataset.active = isActive ? 'true' : 'false';
						}
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
							start: () => getTimelineLineScrollRange(timeline).start,
							end: () => getTimelineLineScrollRange(timeline).end,
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

	let resizeObserver;
	let refreshFrame;

	if (hasAnimatedLines && typeof ResizeObserver !== 'undefined') {
		resizeObserver = new ResizeObserver(() => {
			if (refreshFrame !== undefined) {
				cancelAnimationFrame(refreshFrame);
			}

			refreshFrame = requestAnimationFrame(() => {
				refreshFrame = undefined;
				ScrollTrigger.refresh();
			});
		});
		resizeObserver.observe(document.documentElement);
		resizeObserver.observe(document.body);
	}

	let isCleanedUp = false;

	return () => {
		if (isCleanedUp) {
			return;
		}

		isCleanedUp = true;
		resizeObserver?.disconnect();
		if (refreshFrame !== undefined) {
			cancelAnimationFrame(refreshFrame);
		}
		ctx.revert();
		timelines.forEach((timeline) => {
			const isStatic =
				timeline.dataset.timelineAnimate === 'false' || reducedMotionQuery.matches;

			timeline.querySelectorAll('[data-nova-timeline-marker]').forEach((marker) => {
				marker.dataset.active = isStatic ? 'true' : 'false';
				const content = marker.closest('li')?.querySelector('[data-nova-timeline-content]');
				if (content) {
					content.dataset.active = isStatic ? 'true' : 'false';
				}
			});
		});
	};
};
