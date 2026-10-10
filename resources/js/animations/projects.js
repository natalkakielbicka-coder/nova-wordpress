import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initProjectsAnimation = () => {
	const projects = gsap.utils.toArray('.nova-project-card');

	if (!projects.length) {
		return;
	}

	projects.forEach((project, index) => {
		gsap.to(project, {
			y: 0,
			autoAlpha: 1,
			duration: 0.8,
			delay: index * 0.12,
			ease: 'power3.out',
			overwrite: 'auto',
			scrollTrigger: {
				trigger: project,
				start: 'top 90%',
				once: true,
			},
		});
	});

	window.novaProjectAnimationsReady = true;
};
