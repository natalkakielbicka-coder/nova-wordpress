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

const getTimelineInactiveOpacity = (timeline) => {
	const value = Number(timeline.dataset.timelineInactiveOpacity);

	return Number.isFinite(value) ? Math.min(0.8, Math.max(0.2, value)) : 0.35;
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
			const inactiveOpacity = getTimelineInactiveOpacity(timeline);
			const line = timeline.querySelector('[data-nova-timeline-line]');
			const markers = timeline.querySelectorAll('[data-nova-timeline-marker]');
			const stages = Array.from(markers, (marker) => ({
				marker,
				item: marker.closest('li'),
				content: marker.closest('li')?.querySelector('[data-nova-timeline-content]'),
				position: null,
				active: null,
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
						content.style.opacity = '1';
					}
				});

				return;
			}

			if (line) {
				hasAnimatedLines = true;

				const cacheMarkerPositions = () => {
					const lineTop = line.getBoundingClientRect().top;

					stages.forEach((stage) => {
						stage.position = stage.item
							? stage.item.getBoundingClientRect().top +
								stage.marker.offsetTop +
								stage.marker.offsetHeight / 2 -
								lineTop
							: null;
					});
				};

				const updateMarkers = (progress) => {
					const isComplete = progress >= 1;
					const lineTip = isComplete ? 0 : line.offsetHeight * progress;

					stages.forEach((stage) => {
						const isActive =
							isComplete || (stage.position !== null && stage.position <= lineTip);

						if (stage.active === isActive) {
							return;
						}

						stage.active = isActive;
						stage.marker.dataset.active = isActive ? 'true' : 'false';
						if (stage.content) {
							stage.content.dataset.active = isActive ? 'true' : 'false';
							stage.content.style.opacity = isActive ? '1' : String(inactiveOpacity);
						}
					});
				};

				cacheMarkerPositions();
				updateMarkers(0);

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
							onRefresh: (self) => {
								cacheMarkerPositions();
								updateMarkers(self.progress);
							},
						},
					},
				);
			}

			if (!skipEntranceAnimations) {
				items.forEach((item) => {
					if (
						item.dataset.novaTimelineEntered === 'true' ||
						item.getBoundingClientRect().top <= window.innerHeight
					) {
						item.dataset.novaTimelineEntered = 'true';
						return;
					}

					gsap.from(item, {
						opacity: 0,
						y: 30,
						duration: 0.6,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: item,
							start: 'top 85%',
							once: true,
							onEnter: () => {
								item.dataset.novaTimelineEntered = 'true';
							},
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
			const line = timeline.querySelector('[data-nova-timeline-line]');
			if (line) {
				gsap.set(line, { scaleY: 1 });
			}

			timeline.querySelectorAll('[data-nova-timeline-marker]').forEach((marker) => {
				marker.dataset.active = 'true';
			});
			timeline.querySelectorAll('[data-nova-timeline-content]').forEach((content) => {
				content.dataset.active = 'true';
				content.style.opacity = '1';
			});
		});
	};
};
