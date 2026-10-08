import.meta.glob(['../images/**', '../fonts/**']);

import { initTestimonialsSlider } from './components/testimonials-slider';
import { initMobileMenu } from './components/mobile-menu';
import { initProjectsLayout } from './components/projects-layout';
import { initAnimations } from './animations';

document.addEventListener('DOMContentLoaded', () => {
	initProjectsLayout();
	initAnimations();
});

initTestimonialsSlider();
initMobileMenu();
