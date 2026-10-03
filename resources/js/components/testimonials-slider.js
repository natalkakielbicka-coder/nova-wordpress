import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export const initTestimonialsSlider = () => {
	const slider = document.querySelector('.testimonials-slider');

	if (!slider) {
		return;
	}

	new Swiper(slider, {
		modules: [Navigation, Pagination, Autoplay],

		slidesPerView: 1,
		spaceBetween: 32,
		speed: 700,

		navigation: {
			prevEl: '.testimonial-prev',
			nextEl: '.testimonial-next',
		},

		pagination: {
			el: '.testimonial-pagination',
			clickable: true,
		},

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
	});
};
