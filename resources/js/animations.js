import { initHeroAnimation } from './animations/hero';
import { initProjectsAnimation } from './animations/projects';
import { initPinnedSection } from './animations/pinned-section';

export const initAnimations = () => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	initHeroAnimation();
	initProjectsAnimation();
	initPinnedSection();
};
