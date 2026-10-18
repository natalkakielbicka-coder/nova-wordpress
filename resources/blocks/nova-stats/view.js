const initStats = () => {
	const blocks = document.querySelectorAll('.wp-block-nova-stats[data-stats-animate="true"]');

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	blocks.forEach((block) => {
		const counters = block.querySelectorAll('[data-stats-counter]');

		if (reducedMotion) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					animateCounter(entry.target);
					observer.unobserve(entry.target);
				});
			},
			{
				threshold: 0.3,
			},
		);

		counters.forEach((counter) => {
			observer.observe(counter);
		});
	});
};

const animateCounter = (element) => {
	const original = element.textContent.trim();

	// Liczba z opcjonalnymi separatorami tysięcy,
	// częścią dziesiętną oraz prefiksem/sufiksem.
	const match = original.match(/^([^0-9]*)(\d[\d\s\u00a0\u202f]*(?:[,.]\d+)?)([^0-9]*)$/);

	if (!match) {
		return;
	}

	const [, prefix, rawNumber, suffix] = match;

	const normalized = rawNumber.replace(/[\s\u00a0\u202f]/g, '');

	const decimalSeparator = normalized.includes(',') ? ',' : normalized.includes('.') ? '.' : null;

	const decimals = decimalSeparator ? normalized.split(decimalSeparator)[1].length : 0;

	const target = Number(normalized.replace(',', '.'));

	if (!Number.isFinite(target) || target < 0) {
		return;
	}

	const format = (value) => {
		const formatted = new Intl.NumberFormat('pl-PL', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(value);

		return `${prefix}${formatted}${suffix}`;
	};

	const duration = 1400;
	let startTime = null;

	const tick = (timestamp) => {
		if (startTime === null) {
			startTime = timestamp;
		}

		const progress = Math.min((timestamp - startTime) / duration, 1);

		// Ease out cubic
		const eased = 1 - Math.pow(1 - progress, 3);

		element.textContent = format(target * eased);

		if (progress < 1) {
			requestAnimationFrame(tick);
		} else {
			// Zachowujemy dokładnie oryginalny zapis.
			element.textContent = original;
		}
	};

	requestAnimationFrame(tick);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initStats);
} else {
	initStats();
}
