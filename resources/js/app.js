import.meta.glob(['../images/**', '../fonts/**']);

import { initTestimonialsSlider } from './components/testimonials-slider';
import { initMobileMenu } from './components/mobile-menu';
import { initAnimations } from './animations';

document.addEventListener('DOMContentLoaded', () => {
	initAnimations();
});

initTestimonialsSlider();
initMobileMenu();
