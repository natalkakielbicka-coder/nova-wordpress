import.meta.glob(['../images/**', '../fonts/**']);

import { initMobileMenu } from './components/mobile-menu';
import { initHeaderSearch } from './components/header-search';
import { initThemeToggle } from './components/theme-toggle';
import { initReadingProgress } from './components/reading-progress';

let pageInitializationStarted = false;
let animationInitializationCancelled = false;
let gsapAnimationsCancelled = false;
let gsapAnimationGeneration = 0;
let activeAnimationInitialization;

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const restoreMotionVisibility = () => {
	document.documentElement.classList.remove('nova-motion-ready');
	window.novaProjectAnimationsReady = false;
};

const initializeGSAPAnimations = (session, { skipEntranceAnimations = false } = {}) => {
	if (
		session.cancelled ||
		session.animationsCancelled ||
		session.animationsLoading ||
		session.animationsDisposer ||
		animationInitializationCancelled ||
		gsapAnimationsCancelled ||
		reducedMotionQuery.matches ||
		!session.hasAnimatedElements
	) {
		return;
	}

	const generation = ++gsapAnimationGeneration;
	session.animationsLoading = true;

	import('./animations')
		.then(({ initAnimations }) => {
			if (
				session.cancelled ||
				session.animationsCancelled ||
				animationInitializationCancelled ||
				gsapAnimationsCancelled ||
				reducedMotionQuery.matches ||
				generation !== gsapAnimationGeneration
			) {
				return;
			}

			const disposer = initAnimations({ skipEntranceAnimations });

			if (typeof disposer === 'function') {
				if (
					session.cancelled ||
					session.animationsCancelled ||
					animationInitializationCancelled ||
					gsapAnimationsCancelled ||
					reducedMotionQuery.matches ||
					generation !== gsapAnimationGeneration
				) {
					disposer();
				} else {
					session.animationsDisposer = disposer;
					session.cleanups.push({ type: 'gsap', dispose: disposer });
				}
			}
		})
		.catch((error) => {
			if (generation === gsapAnimationGeneration) {
				restoreMotionVisibility();
			}

			console.error('Failed to load animations:', error);
		})
		.finally(() => {
			if (generation === gsapAnimationGeneration) {
				session.animationsLoading = false;
			}
		});
};

export const disposeAnimationInitializations = () => {
	animationInitializationCancelled = true;
	gsapAnimationGeneration++;
	activeAnimationInitialization?.cleanup();
	restoreMotionVisibility();
};

reducedMotionQuery.addEventListener('change', (event) => {
	if (!event.matches) {
		if (animationInitializationCancelled) {
			return;
		}

		gsapAnimationsCancelled = false;

		if (
			pageInitializationStarted &&
			activeAnimationInitialization?.hasAnimatedElements &&
			activeAnimationInitialization.animationsCancelled
		) {
			activeAnimationInitialization.animationsCancelled = false;
			initializeGSAPAnimations(activeAnimationInitialization, {
				skipEntranceAnimations: true,
			});
		}

		return;
	}

	gsapAnimationsCancelled = true;
	gsapAnimationGeneration++;

	if (activeAnimationInitialization) {
		activeAnimationInitialization.cleanupAnimations();
	} else {
		restoreMotionVisibility();
	}
});

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

	const prefersReducedMotion = reducedMotionQuery.matches;
	if (prefersReducedMotion) {
		restoreMotionVisibility();
	}

	const hasAnimatedElements = document.querySelector(
		'.nova-hero, .nova-project-card, .nova-pin-section',
	);
	const shouldInitializeAnimations =
		hasAnimatedElements && !prefersReducedMotion && !gsapAnimationsCancelled;
	const shouldInitializeProjectsLayout = document.querySelector('.wp-block-nova-projects');

	let session;

	if (
		(hasAnimatedElements || shouldInitializeProjectsLayout) &&
		!animationInitializationCancelled
	) {
		session = {
			cancelled: false,
			cleanups: [],
			hasAnimatedElements: Boolean(hasAnimatedElements),
			animationsCancelled: !shouldInitializeAnimations,
			animationsLoading: false,
			animationsDisposer: null,
			projectsLayoutDisposer: null,
			cleanupAnimations: null,
			cleanup: null,
		};

		session.cleanupAnimations = () => {
			session.animationsCancelled = true;
			session.animationsLoading = false;
			const disposer = session.animationsDisposer;
			session.animationsDisposer = null;
			session.cleanups = session.cleanups.filter(({ type }) => type !== 'gsap');

			if (disposer) {
				try {
					disposer();
				} catch (error) {
					console.error('Failed to clean up GSAP animations:', error);
				}
			}

			restoreMotionVisibility();
		};

		session.cleanup = () => {
			if (session.cancelled) {
				return;
			}

			session.cancelled = true;
			session.cleanupAnimations();

			for (let index = session.cleanups.length - 1; index >= 0; index--) {
				try {
					session.cleanups[index].dispose();
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
		initializeGSAPAnimations(session);
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
						session.cleanups.push({ type: 'projects-layout', dispose: disposer });
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

	if (
		!document.body.classList.contains('logged-in') &&
		document.querySelector('.nova-favorite-toggle[data-product-id]')
	) {
		import('./woocommerce-favorites')
			.then(({ initWooCommerceFavorites }) => {
				initWooCommerceFavorites();
			})
			.catch((error) => {
				console.error('Failed to load WooCommerce favorites:', error);
			});
	}
});

initMobileMenu();
