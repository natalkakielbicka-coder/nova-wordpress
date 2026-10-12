const STORAGE_KEY = 'nova-favorite-product-ids';
const BUTTON_SELECTOR = '.nova-favorite-toggle[data-product-id]';
const FAVORITES_RENDER_BATCH_SIZE = 50;

let activeCleanup;
let favoritesInitialization;
let favoritesBehaviorInitialization;
let favoritesPageInitialization;

const getProductIds = (data) => {
	if (!data || typeof data !== 'object' || !Array.isArray(data.product_ids)) {
		throw new Error('The NOVA favorites response has an invalid product_ids field.');
	}

	const favoriteIds = data.product_ids.map(normalizeProductId);

	if (favoriteIds.some((id) => id === null)) {
		throw new Error('The NOVA favorites response contains an invalid product ID.');
	}

	return [...new Set(favoriteIds)];
};

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

const readFavoritesResult = (storage) => {
	const storedValue = storage.getItem(STORAGE_KEY);

	if (storedValue === null) {
		return { favoriteIds: [], isValid: true };
	}

	try {
		const parsedValue = JSON.parse(storedValue);

		if (!Array.isArray(parsedValue)) {
			console.warn('Ignoring invalid NOVA favorites data: expected an array.');
			return { favoriteIds: [], isValid: false };
		}

		const normalizedIds = parsedValue.map(normalizeProductId);

		if (normalizedIds.some((id) => id === null)) {
			console.warn('Ignoring invalid NOVA favorites data: invalid product ID.');
			return {
				favoriteIds: [...new Set(normalizedIds.filter((id) => id !== null))],
				isValid: false,
			};
		}

		return { favoriteIds: [...new Set(normalizedIds)], isValid: true };
	} catch (error) {
		console.warn('Ignoring invalid NOVA favorites data:', error);
		return { favoriteIds: [], isValid: false };
	}
};

const readFavorites = (storage) => readFavoritesResult(storage).favoriteIds;

const getInitialFavorites = (config) => {
	if (!favoritesInitialization) {
		favoritesInitialization = Promise.resolve()
			.then(() => {
				if (config?.dataset.loggedIn === 'true') {
					return getLoggedInInitialFavorites(config).then((favoriteIds) => ({
						favoriteIds,
						isValid: true,
					}));
				}

				if (config?.dataset.loggedIn !== 'false') {
					throw new Error('The NOVA favorites authentication state is unavailable.');
				}

				let storage;

				try {
					storage = window.localStorage;
					return readFavoritesResult(storage);
				} catch (error) {
					throw new Error('NOVA guest favorites could not be read from localStorage.', {
						cause: error,
					});
				}
			})
			.catch((error) => {
				favoritesInitialization = undefined;
				throw error;
			});
	}

	return favoritesInitialization;
};

const updateFavoritesCount = (favoriteIds) => {
	const count = document.querySelector('#nova-favorites-count');

	if (!count) {
		return;
	}

	const uniqueIds = [...new Set(favoriteIds.map(normalizeProductId).filter((id) => id !== null))];
	const favoritesLink = count.closest('a');

	if (uniqueIds.length === 0) {
		count.textContent = '';
		count.classList.add('hidden');
		favoritesLink?.setAttribute('aria-label', 'Ulubione produkty');
		return;
	}

	count.textContent = String(uniqueIds.length);
	count.classList.remove('hidden');
	favoritesLink?.setAttribute('aria-label', `Ulubione produkty: ${uniqueIds.length}`);
};

const announceFavoritesChange = (favoriteIds) => {
	updateFavoritesCount(favoriteIds);
	document.dispatchEvent(
		new CustomEvent('nova:favorites-updated', {
			detail: { productIds: favoriteIds },
		}),
	);
};

const updateButton = (button, favoriteIds, pendingProductIds = null) => {
	const productId = normalizeProductId(button.dataset.productId);

	if (productId === null) {
		button.hidden = true;
		return;
	}

	const isFavorite = favoriteIds.includes(productId);

	button.setAttribute('aria-pressed', String(isFavorite));
	button.setAttribute('aria-label', isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych');
	button.dataset.state = isFavorite ? 'favorite' : 'not-favorite';
	if (pendingProductIds) {
		const isPending = pendingProductIds.has(productId);
		button.disabled = isPending;

		if (isPending) {
			button.setAttribute('aria-busy', 'true');
		} else {
			button.removeAttribute('aria-busy');
		}
	}

	button.hidden = false;
};

const observeNewButtons = (favoriteIds, pendingProductIds = null) => {
	document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
		updateButton(button, favoriteIds, pendingProductIds);
	});

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(({ addedNodes }) => {
			addedNodes.forEach((node) => {
				if (!(node instanceof Element)) {
					return;
				}

				if (node.matches(BUTTON_SELECTOR)) {
					updateButton(node, favoriteIds, pendingProductIds);
				}

				node.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
					updateButton(button, favoriteIds, pendingProductIds);
				});
			});
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });

	return () => observer.disconnect();
};

const loadLoggedInFavorites = async (config) => {
	const restUrl = config?.dataset.restUrl;
	const nonce = config?.dataset.nonce;

	if (!restUrl || !nonce) {
		throw new Error('The NOVA favorites REST configuration is incomplete.');
	}

	const response = await fetch(restUrl, {
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			Accept: 'application/json',
			'X-WP-Nonce': nonce,
		},
	});

	if (!response.ok) {
		throw new Error(`Loading NOVA favorites failed with HTTP ${response.status}.`);
	}

	return getProductIds(await response.json());
};

const getLoggedInInitialFavorites = async (config) => {
	let storage;

	try {
		storage = window.localStorage;
	} catch (error) {
		console.warn('NOVA guest favorites could not be accessed:', error);
		return loadLoggedInFavorites(config);
	}

	let guestFavorites;

	try {
		guestFavorites = readFavoritesResult(storage);
	} catch (error) {
		console.warn('NOVA guest favorites could not be read:', error);
		return loadLoggedInFavorites(config);
	}

	if (!guestFavorites.isValid || guestFavorites.favoriteIds.length === 0) {
		return loadLoggedInFavorites(config);
	}

	const mergeUrl = new URL(config.dataset.restUrl, window.location.href);
	mergeUrl.pathname = `${mergeUrl.pathname.replace(/\/+$/, '')}/merge`;

	const response = await fetch(mergeUrl.toString(), {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WP-Nonce': config.dataset.nonce,
		},
		body: JSON.stringify({ product_ids: guestFavorites.favoriteIds }),
	});

	if (!response.ok) {
		throw new Error(`Merging NOVA favorites failed with HTTP ${response.status}.`);
	}

	const favoriteIds = getProductIds(await response.json());

	try {
		storage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn('Merged NOVA guest favorites could not be removed from localStorage:', error);
	}

	return favoriteIds;
};

const createStatusRegion = () => {
	const status = document.createElement('div');
	status.className = 'sr-only';
	status.setAttribute('role', 'status');
	status.setAttribute('aria-live', 'polite');
	status.setAttribute('aria-atomic', 'true');
	document.body.append(status);

	return status;
};

const initLoggedInFavorites = (config, initialFavoriteIds) => {
	const pendingProductIds = new Set();
	let favoriteIds = initialFavoriteIds;
	let mutationQueue = Promise.resolve();
	const status = createStatusRegion();

	const updateButtonsForProduct = (productId) => {
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			if (normalizeProductId(button.dataset.productId) === productId) {
				updateButton(button, favoriteIds, pendingProductIds);
			}
		});
	};

	const saveFavorite = async (productId) => {
		const isFavorite = favoriteIds.includes(productId);

		try {
			const response = await fetch(config.dataset.restUrl, {
				method: isFavorite ? 'DELETE' : 'POST',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': config.dataset.nonce,
				},
				body: JSON.stringify({ product_id: productId }),
			});

			if (!response.ok) {
				throw new Error(`Saving NOVA favorites failed with HTTP ${response.status}.`);
			}

			favoriteIds = getProductIds(await response.json());
			document.querySelectorAll(BUTTON_SELECTOR).forEach((favoriteButton) => {
				updateButton(favoriteButton, favoriteIds, pendingProductIds);
			});
			announceFavoritesChange(favoriteIds);
			status.textContent = '';
		} catch (error) {
			console.error('Failed to save logged-in NOVA favorites:', error);
			status.textContent = 'Nie udało się zapisać ulubionych. Spróbuj ponownie.';
		} finally {
			pendingProductIds.delete(productId);
			updateButtonsForProduct(productId);
		}
	};

	const handleClick = (event) => {
		if (!(event.target instanceof Element)) {
			return;
		}

		const button = event.target.closest(BUTTON_SELECTOR);

		if (!button || button.hidden || button.disabled) {
			return;
		}

		const productId = normalizeProductId(button.dataset.productId);

		if (productId === null || pendingProductIds.has(productId)) {
			return;
		}

		pendingProductIds.add(productId);
		updateButtonsForProduct(productId);
		mutationQueue = mutationQueue.then(() => saveFavorite(productId));
	};

	const stopObserving = observeNewButtons(favoriteIds, pendingProductIds);
	document.addEventListener('click', handleClick);

	return () => {
		document.removeEventListener('click', handleClick);
		stopObserving();
		status.remove();
	};
};

const initGuestFavorites = (initialFavoriteIds) => {
	let storage;
	let favoriteIds = initialFavoriteIds;

	try {
		storage = window.localStorage;
	} catch (error) {
		console.warn(
			'NOVA favorites are unavailable because localStorage could not be read:',
			error,
		);
		return () => {};
	}

	const updateButtonsForProduct = (productId) => {
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			if (normalizeProductId(button.dataset.productId) === productId) {
				updateButton(button, favoriteIds);
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
		announceFavoritesChange(favoriteIds);
	};

	document.addEventListener('click', handleClick);

	const stopObserving = observeNewButtons(favoriteIds);

	activeCleanup = () => {
		document.removeEventListener('click', handleClick);
		stopObserving();
		activeCleanup = undefined;
	};

	return activeCleanup;
};

const showFavoritesPageState = (
	grid,
	status,
	message,
	{ isLoading = false, canRetry = false } = {},
) => {
	status.replaceChildren();
	status.textContent = message;
	status.hidden = false;
	status.setAttribute('aria-busy', String(isLoading));
	grid.hidden = true;
	grid.classList.add('hidden');

	if (canRetry) {
		const retryButton = document.createElement('button');
		retryButton.type = 'button';
		retryButton.dataset.favoritesRetry = 'true';
		retryButton.className =
			'mt-4 border border-nova-ink px-6 py-3 text-sm font-medium text-nova-ink transition hover:bg-nova-ink hover:text-nova-white';
		retryButton.textContent = 'Spróbuj ponownie';
		status.append(retryButton);
	}
};

export const initFavoritesPage = (config) => {
	const grid = document.querySelector('#nova-favorites-grid');

	if (!grid || favoritesPageInitialization) {
		return favoritesPageInitialization ?? Promise.resolve();
	}

	const status = document.createElement('p');
	status.className = 'mb-8 text-base text-nova-muted';
	status.setAttribute('role', 'status');
	status.setAttribute('aria-live', 'polite');
	status.setAttribute('aria-atomic', 'true');
	grid.before(status);
	showFavoritesPageState(grid, status, 'Ładowanie ulubionych produktów…', {
		isLoading: true,
	});

	let latestFavoriteIds = null;
	const reconcileRemovedProducts = (favoriteIds) => {
		latestFavoriteIds = favoriteIds;
		grid.querySelectorAll(':scope > .nova-product-card').forEach((card) => {
			const productId = normalizeProductId(
				card.querySelector(BUTTON_SELECTOR)?.dataset.productId,
			);

			if (productId !== null && !favoriteIds.includes(productId)) {
				card.remove();
			}
		});

		if (grid.children.length === 0 && !grid.hidden && !status.hasAttribute('data-error')) {
			showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.');
		}
	};

	const handleFavoritesUpdated = (event) => {
		const productIds = event.detail?.productIds;

		if (Array.isArray(productIds)) {
			reconcileRemovedProducts(productIds);
		}
	};

	const renderFavorites = async () => {
		showFavoritesPageState(grid, status, 'Ładowanie ulubionych produktów…', {
			isLoading: true,
		});
		status.removeAttribute('data-error');

		try {
			const { favoriteIds } = await getInitialFavorites(config);
			await initWooCommerceFavorites(config);

			if (favoriteIds.length === 0) {
				grid.replaceChildren();
				showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.');
				return;
			}

			const favoritesUrl = new URL(config.dataset.restUrl, window.location.href);
			favoritesUrl.pathname = `${favoritesUrl.pathname.replace(/\/+$/, '')}/render`;
			const htmlChunks = [];
			const renderedIds = [];

			for (let index = 0; index < favoriteIds.length; index += FAVORITES_RENDER_BATCH_SIZE) {
				const response = await fetch(favoritesUrl.toString(), {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						product_ids: favoriteIds.slice(index, index + FAVORITES_RENDER_BATCH_SIZE),
					}),
				});

				if (!response.ok) {
					throw new Error(
						`Rendering NOVA favorite products failed with HTTP ${response.status}.`,
					);
				}

				const result = await response.json();
				const batchIds = getProductIds(result);

				if (typeof result.html !== 'string') {
					throw new Error(
						'The NOVA favorites render response has an invalid html field.',
					);
				}

				htmlChunks.push(result.html);
				renderedIds.push(...batchIds);
			}

			grid.innerHTML = htmlChunks.join('');
			reconcileRemovedProducts(latestFavoriteIds ?? renderedIds);

			if (grid.children.length === 0) {
				showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.');
				return;
			}

			status.hidden = true;
			status.textContent = '';
			status.removeAttribute('aria-busy');
			grid.hidden = false;
			grid.classList.remove('hidden');
		} catch (error) {
			console.error('Failed to render NOVA favorite products:', error);
			status.dataset.error = 'true';
			showFavoritesPageState(grid, status, 'Nie udało się wczytać ulubionych produktów.', {
				canRetry: true,
			});
			status.dataset.error = 'true';
		}
	};

	const handleRetry = (event) => {
		if (event.target instanceof Element && event.target.closest('[data-favorites-retry]')) {
			renderFavorites();
		}
	};

	document.addEventListener('nova:favorites-updated', handleFavoritesUpdated);
	status.addEventListener('click', handleRetry);
	favoritesPageInitialization = renderFavorites();

	return favoritesPageInitialization;
};

export const initWooCommerceFavorites = (config) => {
	if (activeCleanup) {
		return activeCleanup;
	}
	if (favoritesBehaviorInitialization) {
		return favoritesBehaviorInitialization;
	}

	if (
		!document.body ||
		(!document.querySelector(BUTTON_SELECTOR) &&
			!document.querySelector('#nova-favorites-grid') &&
			!document.querySelector('#nova-favorites-count'))
	) {
		return () => {};
	}

	favoritesBehaviorInitialization = getInitialFavorites(config)
		.then(({ favoriteIds, isValid }) => {
			if (isValid) {
				updateFavoritesCount(favoriteIds);
			}

			if (activeCleanup) {
				return activeCleanup;
			}

			activeCleanup =
				config?.dataset.loggedIn === 'true'
					? initLoggedInFavorites(config, favoriteIds)
					: initGuestFavorites(favoriteIds);

			return activeCleanup;
		})
		.catch((error) => {
			favoritesBehaviorInitialization = undefined;
			throw error;
		});

	favoritesBehaviorInitialization.catch((error) => {
		console.error('Failed to initialize NOVA favorites:', error);
	});

	return favoritesBehaviorInitialization;
};
