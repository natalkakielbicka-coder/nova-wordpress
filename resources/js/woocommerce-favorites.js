const STORAGE_KEY = 'nova-favorite-product-ids';
const BUTTON_SELECTOR = '.nova-favorite-toggle[data-product-id]';

let activeCleanup;

const normalizeProductId = (value) => {
	if (typeof value === 'number') {
		return Number.isSafeInteger(value) && value > 0 ? value : null;
	}

	if (typeof value !== 'string' || !/^\d+$/.test(value)) {
		return null;
	}

	const productId = Number(value);

	return Number.isSafeInteger(productId) && productId > 0 ? productId : null;
};

const readFavorites = (storage) => {
	const storedValue = storage.getItem(STORAGE_KEY);

	if (storedValue === null) {
		return [];
	}

	try {
		const parsedValue = JSON.parse(storedValue);

		if (!Array.isArray(parsedValue)) {
			console.warn('Ignoring invalid NOVA favorites data: expected an array.');
			return [];
		}

		return [...new Set(parsedValue.map(normalizeProductId).filter((id) => id !== null))];
	} catch (error) {
		console.warn('Ignoring invalid NOVA favorites data:', error);
		return [];
	}
};

export const initWooCommerceFavorites = () => {
	if (activeCleanup) {
		return activeCleanup;
	}

	if (!document.body || document.body.classList.contains('logged-in')) {
		return () => {};
	}

	const buttons = document.querySelectorAll(BUTTON_SELECTOR);

	if (buttons.length === 0) {
		return () => {};
	}

	let storage;
	let favoriteIds;

	try {
		storage = window.localStorage;
		favoriteIds = readFavorites(storage);
	} catch (error) {
		console.warn('NOVA favorites are unavailable because localStorage could not be read:', error);
		return () => {};
	}

	const updateButton = (button) => {
		const productId = normalizeProductId(button.dataset.productId);

		if (productId === null) {
			button.hidden = true;
			return;
		}

		const isFavorite = favoriteIds.includes(productId);

		button.setAttribute('aria-pressed', String(isFavorite));
		button.setAttribute(
			'aria-label',
			isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych',
		);
		button.dataset.state = isFavorite ? 'favorite' : 'not-favorite';
		button.hidden = false;
	};

	const updateButtonsForProduct = (productId) => {
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			if (normalizeProductId(button.dataset.productId) === productId) {
				updateButton(button);
			}
		});
	};

	const handleClick = (event) => {
		if (!(event.target instanceof Element)) {
			return;
		}

		const button = event.target.closest(BUTTON_SELECTOR);

		if (!button || button.hidden) {
			return;
		}

		const productId = normalizeProductId(button.dataset.productId);

		if (productId === null) {
			button.hidden = true;
			return;
		}

		const isFavorite = favoriteIds.includes(productId);
		const nextFavoriteIds = isFavorite
			? favoriteIds.filter((id) => id !== productId)
			: [...favoriteIds, productId];

		try {
			storage.setItem(STORAGE_KEY, JSON.stringify(nextFavoriteIds));
		} catch (error) {
			console.warn('Could not save NOVA favorites to localStorage:', error);
			return;
		}

		favoriteIds = nextFavoriteIds;
		updateButtonsForProduct(productId);
	};

	buttons.forEach(updateButton);
	document.addEventListener('click', handleClick);

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(({ addedNodes }) => {
			addedNodes.forEach((node) => {
				if (!(node instanceof Element)) {
					return;
				}

				if (node.matches(BUTTON_SELECTOR)) {
					updateButton(node);
				}

				node.querySelectorAll(BUTTON_SELECTOR).forEach(updateButton);
			});
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });

	activeCleanup = () => {
		document.removeEventListener('click', handleClick);
		observer.disconnect();
		activeCleanup = undefined;
	};

	return activeCleanup;
};
