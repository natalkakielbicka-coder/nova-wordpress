export const initAnimations = async () => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	const animations = [];

	if (document.querySelector('.nova-hero')) {
		animations.push(
			import('./animations/hero').then(({ initHeroAnimation }) => {
				initHeroAnimation();
			}),
		);
	}

	if (document.querySelector('.nova-project-card')) {
		animations.push(
			import('./animations/projects')
				.then(({ initProjectsAnimation }) => {
					initProjectsAnimation();
				})
				.catch((error) => {
					document.documentElement.classList.remove('nova-motion-ready');
					console.error('Failed to initialize project animations:', error);
				}),
		);
	}

	if (document.querySelector('.nova-pin-section')) {
		animations.push(
			import('./animations/pinned-section').then(({ initPinnedSection }) => {
				initPinnedSection();
			}),
		);
	}

	const results = await Promise.allSettled(animations);

	results.forEach((result) => {
		if (result.status === 'rejected') {
			console.error('Failed to initialize animation:', result.reason);
		}
	});
};
