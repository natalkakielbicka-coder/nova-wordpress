const STORAGE_KEY = 'nova-theme';

export const initThemeToggle = () => {
	const button = document.querySelector('#nova-theme-toggle');
	const moonIcon = button.querySelector('.nova-theme-icon-moon');
	const sunIcon = button.querySelector('.nova-theme-icon-sun');

	if (!button) {
		return;
	}

	const getStoredTheme = () => {
		try {
			return localStorage.getItem(STORAGE_KEY);
		} catch {
			return null;
		}
	};

	const saveTheme = (theme) => {
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Motyw nadal działa bez localStorage.
		}
	};

	const getSystemTheme = () =>
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

	const applyTheme = (theme) => {
		document.documentElement.dataset.theme = theme;

		const isDark = theme === 'dark';
		moonIcon?.classList.toggle('hidden', isDark);
		sunIcon?.classList.toggle('hidden', !isDark);

		button.setAttribute('aria-pressed', String(isDark));
		button.setAttribute('aria-label', isDark ? 'Włącz jasny motyw' : 'Włącz ciemny motyw');
	};

	const storedTheme = getStoredTheme();

	applyTheme(storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemTheme());

	button.addEventListener('click', () => {
		const isDark = document.documentElement.dataset.theme === 'dark';

		const nextTheme = isDark ? 'light' : 'dark';

		document.documentElement.classList.add('theme-transition');

		applyTheme(nextTheme);
		saveTheme(nextTheme);
	});
};
