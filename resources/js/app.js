import.meta.glob(['../images/**', '../fonts/**']);

import { initMobileMenu } from './components/mobile-menu';
import { initHeaderSearch } from './components/header-search';
import { initThemeToggle } from './components/theme-toggle';
import { initReadingProgress } from './components/reading-progress';

let pageInitializationStarted = false;
let animationInitializationCancelled = false;
let activeAnimationInitialization;

export const disposeAnimationInitializations = () => {
	animationInitializationCancelled = true;
	activeAnimationInitialization?.cleanup();
	document.documentElement.classList.remove('nova-motion-ready');
};

document.addEventListener('DOMContentLoaded', () => {
	if (pageInitializationStarted) {
		return;
	}

	pageInitializationStarted = true;

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
	const shouldInitializeAnimations = hasAnimatedElements && !prefersReducedMotion;
	const shouldInitializeProjectsLayout = document.querySelector('.wp-block-nova-projects');

	let session;

	if (
		(shouldInitializeAnimations || shouldInitializeProjectsLayout) &&
		!animationInitializationCancelled
	) {
		session = {
			cancelled: false,
			cleanups: [],
			animationsDisposer: null,
			projectsLayoutDisposer: null,
			cleanup: null,
		};

		session.cleanup = () => {
			if (session.cancelled) {
				return;
			}

			session.cancelled = true;

			for (let index = session.cleanups.length - 1; index >= 0; index--) {
				try {
					session.cleanups[index]();
				} catch (error) {
					console.error('Failed to clean up animation initialization:', error);
				}
			}

			session.animationsDisposer = null;
			session.projectsLayoutDisposer = null;

			if (activeAnimationInitialization === session) {
				activeAnimationInitialization = null;
			}
		};

		activeAnimationInitialization = session;
	}

	if (shouldInitializeAnimations && session) {
		import('./animations')
			.then(({ initAnimations }) => {
				if (session.cancelled) {
					return;
				}

				const disposer = initAnimations();

				if (typeof disposer === 'function') {
					if (session.cancelled) {
						disposer();
					} else {
						session.animationsDisposer = disposer;
						session.cleanups.push(disposer);
					}
				}
			})
			.catch((error) => {
				document.documentElement.classList.remove('nova-motion-ready');
				console.error('Failed to load animations:', error);
			});
	}

	if (shouldInitializeProjectsLayout && session) {
		import('./components/projects-layout')
			.then(({ initProjectsLayout }) => {
				if (session.cancelled) {
					return;
				}

				const disposer = initProjectsLayout();

				if (typeof disposer === 'function') {
					if (session.cancelled) {
						disposer();
					} else {
						session.projectsLayoutDisposer = disposer;
						session.cleanups.push(disposer);
					}
				}
			})
			.catch((error) => {
				console.error('Failed to load projects layout:', error);
			});
	}

	if (document.querySelector('.woocommerce-product-gallery')) {
		import('./woocommerce-gallery').then(({ initWooCommerceGallery }) => {
			initWooCommerceGallery();
		});
	}

	if (document.querySelector('.nova-product-card__actions')) {
		import('./woocommerce-product-card').then(({ initProductCardButtons }) => {
			initProductCardButtons();
		});
	}
});

initMobileMenu();
