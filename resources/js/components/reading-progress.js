export const initReadingProgress = () => {
	const progressBar = document.querySelector('#nova-reading-progress');

	if (!progressBar) {
		return;
	}

	let ticking = false;

	const updateProgress = () => {
		const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

		const progress =
			scrollableHeight > 0
				? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
				: 100;

		progressBar.style.transform = `scaleX(${progress / 100})`;

		progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));

		ticking = false;
	};

	const requestUpdate = () => {
		if (ticking) {
			return;
		}

		ticking = true;

		requestAnimationFrame(updateProgress);
	};

	window.addEventListener('scroll', requestUpdate, {
		passive: true,
	});

	window.addEventListener('resize', requestUpdate);

	updateProgress();
};
