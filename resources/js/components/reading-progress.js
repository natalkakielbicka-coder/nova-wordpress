export const initReadingProgress = () => {
	const progressBar = document.querySelector('#nova-reading-progress');
	const articleContent = document.querySelector('.nova-article-content');

	if (!progressBar || !articleContent) {
		return;
	}

	let ticking = false;

	const updateProgress = () => {
		const articleRect = articleContent.getBoundingClientRect();

		const articleTop = articleRect.top + window.scrollY;
		const articleBottom = articleRect.bottom + window.scrollY;

		const viewportHeight = window.innerHeight;

		const start = articleTop - viewportHeight;
		const end = articleBottom - viewportHeight;

		const progress =
			end > start
				? Math.min(100, Math.max(0, ((window.scrollY - start) / (end - start)) * 100))
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
