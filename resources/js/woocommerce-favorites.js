const STORAGE_KEY = 'nova-favorite-product-ids';
const BUTTON_SELECTOR = '.nova-favorite-toggle[data-product-id]';
const FAVORITES_RENDER_BATCH_SIZE = 50;

let activeCleanup;
let favoritesInitialization;
let favoritesBehaviorInitialization;
let favoritesPageInitialization;
let clearFavoritesHandler;
let favoritesToast;
let favoritesToastTimeout;

const showFavoritesToast = (message) => {
	if (!favoritesToast) {
		favoritesToast = document.createElement('div');
		favoritesToast.className =
			'fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-sm rounded bg-nova-ink px-5 py-4 text-center text-sm font-medium text-nova-white shadow-lg md:inset-x-auto md:right-6 md:bottom-6';
		favoritesToast.setAttribute('role', 'status');
		favoritesToast.setAttribute('aria-live', 'polite');
		favoritesToast.setAttribute('aria-atomic', 'true');
		favoritesToast.hidden = true;
		document.body.append(favoritesToast);
	}

	window.clearTimeout(favoritesToastTimeout);
	favoritesToast.textContent = message;
	favoritesToast.hidden = false;
	favoritesToastTimeout = window.setTimeout(() => {
		favoritesToast.hidden = true;
	}, 3000);
};

const showFavoriteAddedToast = () => {
	showFavoritesToast('Produkt dodany do ulubionych');
};

const showFavoriteRemovedToast = () => {
	showFavoritesToast('Produkt usunięty z ulubionych');
};

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
	const isPending = pendingProductIds?.has(productId) ?? false;
	button.disabled = isPending;

	if (isPending) {
		button.setAttribute('aria-busy', 'true');
	} else {
		button.removeAttribute('aria-busy');
	}

	button.hidden = false;

	if (button.dataset.ready !== 'true') {
		window.requestAnimationFrame(() => {
			if (button.isConnected) {
				button.dataset.ready = 'true';
			}
		});
	}
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

const loadGuestFavorites = () => {
	try {
		return readFavoritesResult(window.localStorage).favoriteIds;
	} catch (error) {
		throw new Error('NOVA guest favorites could not be read from localStorage.', {
			cause: error,
		});
	}
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
	let isClearing = false;
	const status = createStatusRegion();

	const updateButtonsForProduct = (productId) => {
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			if (normalizeProductId(button.dataset.productId) === productId) {
				updateButton(button, favoriteIds, pendingProductIds);
			}
		});
	};

	const handleFavoritesUpdated = (event) => {
		const productIds = event.detail?.productIds;

		if (!Array.isArray(productIds)) {
			return;
		}

		favoriteIds = getProductIds({ product_ids: productIds });
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			updateButton(button, favoriteIds, pendingProductIds);
		});
	};

	const saveFavorite = async (productId, { showToast = true } = {}) => {
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
			if (showToast && !isFavorite && favoriteIds.includes(productId)) {
				showFavoriteAddedToast();
			} else if (showToast && isFavorite && !favoriteIds.includes(productId)) {
				showFavoriteRemovedToast();
			}
			const mutationConfirmed = favoriteIds.includes(productId) === !isFavorite;
			status.textContent = mutationConfirmed
				? ''
				: 'Nie udało się zapisać ulubionych. Spróbuj ponownie.';
			return mutationConfirmed;
		} catch (error) {
			console.error('Failed to save logged-in NOVA favorites:', error);
			status.textContent = 'Nie udało się zapisać ulubionych. Spróbuj ponownie.';
			return false;
		} finally {
			pendingProductIds.delete(productId);
			updateButtonsForProduct(productId);
		}
	};

	const deleteFavorite = async (productId) => {
		if (!favoriteIds.includes(productId)) {
			pendingProductIds.delete(productId);
			updateButtonsForProduct(productId);
			return true;
		}

		try {
			const response = await fetch(config.dataset.restUrl, {
				method: 'DELETE',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': config.dataset.nonce,
				},
				body: JSON.stringify({ product_id: productId }),
			});

			if (!response.ok) {
				throw new Error(`Removing NOVA favorite failed with HTTP ${response.status}.`);
			}

			favoriteIds = getProductIds(await response.json());
			document.querySelectorAll(BUTTON_SELECTOR).forEach((favoriteButton) => {
				updateButton(favoriteButton, favoriteIds, pendingProductIds);
			});
			announceFavoritesChange(favoriteIds);

			const mutationConfirmed = !favoriteIds.includes(productId);
			status.textContent = mutationConfirmed
				? ''
				: 'Nie udało się zapisać ulubionych. Spróbuj ponownie.';
			return mutationConfirmed;
		} catch (error) {
			console.error('Failed to remove logged-in NOVA favorite:', error);
			status.textContent = 'Nie udało się zapisać ulubionych. Spróbuj ponownie.';
			return false;
		} finally {
			pendingProductIds.delete(productId);
			updateButtonsForProduct(productId);
		}
	};

	const handleClick = (event) => {
		if (isClearing) {
			return;
		}

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
	document.addEventListener('nova:favorites-updated', handleFavoritesUpdated);
	clearFavoritesHandler = () => {
		if (isClearing) {
			return mutationQueue;
		}

		isClearing = true;
		const clearOperation = mutationQueue.then(async () => {
			const productIds = [...favoriteIds];
			productIds.forEach((productId) => pendingProductIds.add(productId));
			productIds.forEach(updateButtonsForProduct);

			const failedIds = [];

			for (const productId of productIds) {
				const removed = await deleteFavorite(productId);

				if (!removed && favoriteIds.includes(productId)) {
					failedIds.push(productId);
				}
			}

			return { success: failedIds.length === 0, failedIds };
		});

		mutationQueue = clearOperation.then(
			(result) => {
				isClearing = false;
				return undefined;
			},
			() => {
				isClearing = false;
				return undefined;
			},
		);

		return clearOperation;
	};

	return () => {
		document.removeEventListener('click', handleClick);
		document.removeEventListener('nova:favorites-updated', handleFavoritesUpdated);
		stopObserving();
		status.remove();
		clearFavoritesHandler = undefined;
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

	const handleFavoritesUpdated = (event) => {
		const productIds = event.detail?.productIds;

		if (!Array.isArray(productIds)) {
			return;
		}

		favoriteIds = getProductIds({ product_ids: productIds });
		document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
			updateButton(button, favoriteIds);
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
		if (!isFavorite) {
			showFavoriteAddedToast();
		} else {
			showFavoriteRemovedToast();
		}
	};

	document.addEventListener('click', handleClick);
	document.addEventListener('nova:favorites-updated', handleFavoritesUpdated);

	const stopObserving = observeNewButtons(favoriteIds);

	clearFavoritesHandler = () => {
		try {
			storage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.warn('Could not clear NOVA favorites from localStorage:', error);
			return { success: false, failedIds: [...favoriteIds] };
		}

		favoriteIds = [];
		document
			.querySelectorAll(BUTTON_SELECTOR)
			.forEach((button) => updateButton(button, favoriteIds));
		announceFavoritesChange(favoriteIds);

		return { success: true, failedIds: [] };
	};

	activeCleanup = () => {
		document.removeEventListener('click', handleClick);
		document.removeEventListener('nova:favorites-updated', handleFavoritesUpdated);
		stopObserving();
		activeCleanup = undefined;
		clearFavoritesHandler = undefined;
	};

	return activeCleanup;
};

const showFavoritesPageState = (
	grid,
	status,
	message,
	{ isLoading = false, canRetry = false, isEmpty = false } = {},
) => {
	const shopLink = document.querySelector('#nova-favorites-shop-link');
	const productCount = document.querySelector('#nova-favorites-product-count');
	const clearButton = document.querySelector('#nova-favorites-clear');

	status.replaceChildren();
	status.textContent = message;
	status.hidden = false;
	status.setAttribute('aria-busy', String(isLoading));
	if (isLoading) {
		const skeleton = document.querySelector('#nova-favorites-skeleton');
		grid.replaceChildren(
			...(skeleton instanceof HTMLTemplateElement ? [skeleton.content.cloneNode(true)] : []),
		);
		grid.hidden = !(skeleton instanceof HTMLTemplateElement);
		grid.classList.toggle('hidden', grid.hidden);
	} else {
		grid.replaceChildren();
		grid.hidden = true;
		grid.classList.add('hidden');
	}
	if (shopLink) {
		shopLink.hidden = !isEmpty || !shopLink.getAttribute('href');
	}
	if (productCount) {
		productCount.hidden = true;
		productCount.textContent = '';
	}
	if (clearButton) {
		clearButton.hidden = true;
	}

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
	let renderPromise;
	let hasRenderedInitialFavorites = false;
	let favoritesChangeVersion = 0;
	const updateDisplayedProductCount = (count) => {
		const productCount = document.querySelector('#nova-favorites-product-count');
		const clearButton = document.querySelector('#nova-favorites-clear');

		if (productCount) {
			productCount.textContent = `Zapisane produkty: ${count}`;
			productCount.hidden = count === 0;
		}

		if (clearButton) {
			clearButton.hidden = count === 0;
		}
	};

	const reconcileRemovedProducts = (favoriteIds) => {
		latestFavoriteIds = favoriteIds;

		if (status.getAttribute('aria-busy') === 'true') {
			return;
		}

		grid.querySelectorAll(':scope > .nova-product-card').forEach((card) => {
			const productId = normalizeProductId(
				card.querySelector(BUTTON_SELECTOR)?.dataset.productId,
			);

			if (productId !== null && !favoriteIds.includes(productId)) {
				card.remove();
			}
		});

		if (grid.children.length === 0 && !grid.hidden && !status.hasAttribute('data-error')) {
			updateDisplayedProductCount(0);
			showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.', {
				isEmpty: true,
			});
		} else if (!grid.hidden) {
			updateDisplayedProductCount(grid.children.length);
		}
	};

	const handleFavoritesUpdated = (event) => {
		const productIds = event.detail?.productIds;

		if (Array.isArray(productIds)) {
			favoritesChangeVersion += 1;
			reconcileRemovedProducts(productIds);
		}
	};

	const performRenderFavorites = async () => {
		showFavoritesPageState(grid, status, 'Ładowanie ulubionych produktów…', {
			isLoading: true,
		});
		status.removeAttribute('data-error');

		try {
			const changeVersionAtLoadStart = favoritesChangeVersion;
			const initialFavorites = await getInitialFavorites(config);
			await initWooCommerceFavorites(config);
			let favoriteIds = initialFavorites.favoriteIds;

			if (hasRenderedInitialFavorites) {
				favoriteIds =
					config?.dataset.loggedIn === 'true'
						? await loadLoggedInFavorites(config)
						: loadGuestFavorites();
			}

			hasRenderedInitialFavorites = true;
			if (favoritesChangeVersion === changeVersionAtLoadStart) {
				latestFavoriteIds = favoriteIds;
				announceFavoritesChange(favoriteIds);
			} else {
				favoriteIds = latestFavoriteIds ?? favoriteIds;
			}

			const favoritesUrl = new URL(config.dataset.restUrl, window.location.href);
			favoritesUrl.pathname = `${favoritesUrl.pathname.replace(/\/+$/, '')}/render`;
			let htmlChunks;
			let renderedIds;

			while (favoriteIds.length > 0) {
				const renderVersion = favoritesChangeVersion;
				htmlChunks = [];
				renderedIds = [];

				for (
					let index = 0;
					index < favoriteIds.length;
					index += FAVORITES_RENDER_BATCH_SIZE
				) {
					if (favoritesChangeVersion !== renderVersion) {
						break;
					}

					const response = await fetch(favoritesUrl.toString(), {
						method: 'POST',
						credentials: 'same-origin',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							product_ids: favoriteIds.slice(
								index,
								index + FAVORITES_RENDER_BATCH_SIZE,
							),
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

				if (favoritesChangeVersion === renderVersion) {
					break;
				}

				favoriteIds = latestFavoriteIds ?? favoriteIds;
			}

			if (favoriteIds.length === 0) {
				grid.replaceChildren();
				updateDisplayedProductCount(0);
				showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.', {
					isEmpty: true,
				});
				return;
			}

			grid.innerHTML = htmlChunks.join('');
			status.removeAttribute('aria-busy');
			reconcileRemovedProducts(latestFavoriteIds ?? renderedIds);

			if (grid.children.length === 0) {
				updateDisplayedProductCount(0);
				showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.', {
					isEmpty: true,
				});
				return;
			}

			status.hidden = true;
			status.textContent = '';
			status.removeAttribute('aria-busy');
			grid.hidden = false;
			grid.classList.remove('hidden');
			updateDisplayedProductCount(grid.children.length);
		} catch (error) {
			console.error('Failed to render NOVA favorite products:', error);
			status.dataset.error = 'true';
			showFavoritesPageState(grid, status, 'Nie udało się wczytać ulubionych produktów.', {
				canRetry: true,
			});
			status.dataset.error = 'true';
		}
	};

	const renderFavorites = () => {
		if (renderPromise) {
			return renderPromise;
		}

		renderPromise = performRenderFavorites().finally(() => {
			renderPromise = undefined;
		});

		return renderPromise;
	};

	const handleRetry = (event) => {
		if (event.target instanceof Element && event.target.closest('[data-favorites-retry]')) {
			const retryButton = event.target.closest('[data-favorites-retry]');

			if (retryButton instanceof HTMLButtonElement) {
				retryButton.disabled = true;
				retryButton.setAttribute('aria-busy', 'true');
			}

			void renderFavorites();
		}
	};

	const clearButton = document.querySelector('#nova-favorites-clear');
	const clearDialog = document.querySelector('#nova-favorites-clear-dialog');
	const clearDialogCancel = document.querySelector('#nova-favorites-clear-cancel');
	const clearDialogConfirm = document.querySelector('#nova-favorites-clear-confirm');
	const clearDialogError = document.querySelector('#nova-favorites-clear-error');
	let clearDialogBusy = false;
	let clearDialogReturnFocus;
	const handleClearFavorites = async () => {
		if (!clearButton || clearButton.disabled || !clearFavoritesHandler) {
			return false;
		}

		const originalLabel = 'Wyczyść ulubione';
		clearButton.disabled = true;
		clearButton.setAttribute('aria-busy', 'true');
		clearButton.textContent = 'Czyszczenie…';
		status.removeAttribute('data-error');
		if (clearDialogError) {
			clearDialogError.textContent = '';
			clearDialogError.hidden = true;
		}

		try {
			const result = await clearFavoritesHandler();

			if (!result.success) {
				const message = `Nie udało się usunąć ${result.failedIds.length} produktów. Możesz ponowić próbę.`;
				status.textContent = message;
				status.hidden = false;
				status.removeAttribute('aria-busy');
				status.dataset.error = 'true';
				if (clearDialogError) {
					clearDialogError.textContent = message;
					clearDialogError.hidden = false;
				}
				return false;
			}

			grid.replaceChildren();
			updateDisplayedProductCount(0);
			showFavoritesPageState(grid, status, 'Nie masz jeszcze ulubionych produktów.', {
				isEmpty: true,
			});
			return true;
		} catch (error) {
			console.error('Failed to clear NOVA favorites:', error);
			const message = 'Nie udało się wyczyścić ulubionych. Możesz ponowić próbę.';
			status.textContent = message;
			status.hidden = false;
			status.removeAttribute('aria-busy');
			status.dataset.error = 'true';
			if (clearDialogError) {
				clearDialogError.textContent = message;
				clearDialogError.hidden = false;
			}
			return false;
		} finally {
			clearButton.textContent = originalLabel;
			clearButton.disabled = false;
			clearButton.removeAttribute('aria-busy');
		}
	};

	const handleOpenClearDialog = () => {
		if (
			!clearDialog ||
			typeof clearDialog.showModal !== 'function' ||
			!clearFavoritesHandler ||
			clearButton?.disabled
		) {
			return;
		}

		clearDialogReturnFocus = document.activeElement;
		clearDialogError?.setAttribute('hidden', '');
		if (clearDialogError) {
			clearDialogError.textContent = '';
		}
		clearDialog.showModal();
		clearDialogCancel?.focus();
	};

	const handleConfirmClear = async () => {
		if (!clearDialog?.open || clearDialogBusy || !clearDialogConfirm) {
			return;
		}

		clearDialogBusy = true;
		clearDialogConfirm.disabled = true;
		clearDialogConfirm.setAttribute('aria-busy', 'true');
		clearDialogConfirm.textContent = 'Usuwanie…';
		if (clearDialogCancel) {
			clearDialogCancel.disabled = true;
		}

		try {
			const succeeded = await handleClearFavorites();

			if (succeeded && clearDialog.open) {
				clearDialog.close('success');
			}
		} finally {
			clearDialogBusy = false;
			clearDialogConfirm.disabled = false;
			clearDialogConfirm.removeAttribute('aria-busy');
			clearDialogConfirm.textContent = 'Usuń wszystkie';
			if (clearDialogCancel) {
				clearDialogCancel.disabled = false;
			}
		}
	};

	const handleClearDialogCancel = (event) => {
		if (clearDialogBusy) {
			event.preventDefault();
		}
	};

	const handleClearDialogClose = () => {
		const isAvailableFocusTarget = (element) =>
			element instanceof HTMLElement &&
			element.isConnected &&
			!element.hidden &&
			!element.matches(':disabled') &&
			!element.closest('[inert]') &&
			element.getClientRects().length > 0 &&
			window.getComputedStyle(element).visibility !== 'hidden';
		const shopLink = document.querySelector('#nova-favorites-shop-link');
		const favoritesPage = document.querySelector('#nova-favorites-page');
		const focusCandidates =
			clearDialog?.returnValue === 'success'
				? [shopLink, favoritesPage]
				: [clearButton, clearDialogReturnFocus, shopLink, favoritesPage];
		const focusTarget = focusCandidates.find(isAvailableFocusTarget);

		if (focusTarget) {
			focusTarget.focus();
		}
		clearDialogReturnFocus = undefined;
	};

	document.addEventListener('nova:favorites-updated', handleFavoritesUpdated);
	status.addEventListener('click', handleRetry);
	clearButton?.addEventListener('click', handleOpenClearDialog);
	clearDialogCancel?.addEventListener('click', () => clearDialog?.close('cancel'));
	clearDialogConfirm?.addEventListener('click', handleConfirmClear);
	clearDialog?.addEventListener('cancel', handleClearDialogCancel);
	clearDialog?.addEventListener('close', handleClearDialogClose);
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
