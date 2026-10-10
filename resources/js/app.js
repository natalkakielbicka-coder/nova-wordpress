import.meta.glob(['../images/**', '../fonts/**']);

import { initMobileMenu } from './components/mobile-menu';
import { initHeaderSearch } from './components/header-search';
import { initThemeToggle } from './components/theme-toggle';
import { initReadingProgress } from './components/reading-progress';

document.addEventListener('DOMContentLoaded', () => {
	initHeaderSearch();
	initThemeToggle();
	initReadingProgress();

	if (document.querySelector('#nova-blog-search')) {
		import('./components/blog-search')
			.then(({ initBlogSearch }) => {
				initBlogSearch();
			})
			.catch((error) => {
				console.error('Failed to load blog search:', error);
			});
	}

	if (document.querySelector('#nova-load-more')) {
		import('./components/load-more')
			.then(({ initLoadMore }) => {
				initLoadMore();
			})
			.catch((error) => {
				console.error('Failed to load more module:', error);
			});
	}

	if (document.querySelector('.testimonials-slider')) {
		import('./components/testimonials-slider')
			.then(({ initTestimonialsSlider }) => {
				initTestimonialsSlider();
			})
			.catch((error) => {
				console.error('Failed to load testimonials slider:', error);
			});
	}

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const hasAnimatedElements = document.querySelector(
		'.nova-hero, .nova-project-card, .nova-pin-section',
	);

	if (hasAnimatedElements && !prefersReducedMotion) {
		import('./animations')
			.then(({ initAnimations }) => {
				initAnimations();
			})
			.catch((error) => {
				document.documentElement.classList.remove('nova-motion-ready');
				console.error('Failed to load animations:', error);
			});
	}

	if (document.querySelector('.wp-block-nova-projects')) {
		import('./components/projects-layout')
			.then(({ initProjectsLayout }) => {
				initProjectsLayout();
			})
			.catch((error) => {
				console.error('Failed to load projects layout:', error);
			});
	}
});

initMobileMenu();
