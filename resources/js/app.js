import.meta.glob(['../images/**', '../fonts/**']);

import { initTestimonialsSlider } from './components/testimonials-slider';
import { initMobileMenu } from './components/mobile-menu';
import { initProjectsLayout } from './components/projects-layout';
import { initAnimations } from './animations';
import { initBlogSearch } from './components/blog-search';
import { initLoadMore } from './components/load-more';
import { initHeaderSearch } from './components/header-search';

document.addEventListener('DOMContentLoaded', () => {
	initProjectsLayout();
	initAnimations();
	initBlogSearch();
	initLoadMore();
	initHeaderSearch();
});

initTestimonialsSlider();
initMobileMenu();
