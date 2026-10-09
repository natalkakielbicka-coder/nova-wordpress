import { createPostCard } from './post-card';

const createPagination = (currentPage, totalPages, onPageChange) => {
	const list = document.createElement('ul');
	list.className = 'page-numbers';

	const addButton = (label, page, isCurrent = false) => {
		const item = document.createElement('li');
		const button = document.createElement('button');

		button.type = 'button';
		button.textContent = label;
		button.className = `page-numbers${isCurrent ? ' current' : ''}`;

		if (isCurrent) {
			button.setAttribute('aria-current', 'page');
			button.disabled = true;
		} else {
			button.addEventListener('click', () => onPageChange(page));
		}

		item.append(button);
		list.append(item);
	};

	if (currentPage > 1) {
		addButton('← Poprzednia', currentPage - 1);
	}

	for (let page = 1; page <= totalPages; page++) {
		if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
			addButton(String(page), page, page === currentPage);
		} else if (page === 2 || page === totalPages - 1) {
			const item = document.createElement('li');
			const dots = document.createElement('span');
			dots.className = 'page-numbers dots';
			dots.textContent = '…';
			item.append(dots);
			list.append(item);
		}
	}

	return list;
};

export const initBlogSearch = () => {
	const input = document.querySelector('#nova-blog-search');
	const results = document.querySelector('#nova-blog-results');
	const status = document.querySelector('#nova-blog-search-status');
	const pagination = document.querySelector('#nova-blog-pagination');
	const paginationOriginal = pagination?.innerHTML || '';
	const loadMoreWrapper = document.querySelector('#nova-load-more-wrapper');

	if (!input || !results || !status) {
		return;
	}

	let originalContent = results.innerHTML;

	results.addEventListener('nova:posts-loaded', () => {
		if (!input.value.trim()) {
			originalContent = results.innerHTML;
		}
	});

	let controller = null;
	let requestId = 0;

	const updateUrl = (query, page = 1) => {
		const url = new URL(window.location.href);

		// Usuwamy paginację WordPressa z adresu.
		url.pathname = url.pathname.replace(/\/page\/\d+\/?$/, '/');

		if (query.trim()) {
			url.searchParams.set('search', query.trim());
		} else {
			url.searchParams.delete('search');
		}

		url.searchParams.delete('page');

		if (query.trim() && page > 1) {
			url.searchParams.set('search_page', String(page));
		} else {
			url.searchParams.delete('search_page');
		}

		window.history.pushState({}, '', url);
	};

	const searchPosts = async (query, page = 1, updateHistory = true) => {
		controller?.abort();
		controller = null;

		const currentRequest = ++requestId;

		if (loadMoreWrapper) {
			loadMoreWrapper.classList.toggle('hidden', Boolean(query.trim()));
		}

		if (!query.trim()) {
			if (updateHistory) {
				updateUrl('', 1);
			}

			results.innerHTML = originalContent;
			status.textContent = '';
			if (pagination) {
				pagination.innerHTML = paginationOriginal;
				pagination.hidden = Boolean(loadMoreWrapper);
			}
			return;
		}

		controller = new AbortController();

		status.textContent = 'Wyszukiwanie...';

		if (pagination) pagination.hidden = true;

		const url = new URL('/wp-json/wp/v2/posts', window.location.origin);

		url.searchParams.set('search', query.trim());
		url.searchParams.set('per_page', '9');
		url.searchParams.set('page', String(page));
		url.searchParams.set('_embed', '1');
		url.searchParams.set('_fields', 'id,link,title,excerpt,date,_links,_embedded');

		try {
			const response = await fetch(url, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const posts = await response.json();
			const totalPosts = Number(response.headers.get('X-WP-Total') || 0);
			const totalPages = Number(response.headers.get('X-WP-TotalPages') || 0);

			if (currentRequest !== requestId) {
				return;
			}

			if (updateHistory) {
				updateUrl(query, page);
			}

			results.replaceChildren();

			if (!posts.length) {
				status.textContent = 'Nie znaleziono artykułów.';
				return;
			}

			posts.forEach((post) => {
				results.append(createPostCard(post));
			});

			if (pagination) {
				pagination.replaceChildren();

				if (totalPages > 1) {
					pagination.append(
						createPagination(page, totalPages, (nextPage) => {
							searchPosts(query, nextPage);

							input.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							});
						}),
					);

					pagination.hidden = false;
				} else {
					pagination.hidden = true;
				}
			}

			status.textContent = `Znaleziono ${totalPosts} artykułów. Strona ${page} z ${totalPages}.`;
		} catch (error) {
			if (error.name === 'AbortError') {
				return;
			}

			if (currentRequest !== requestId) {
				return;
			}

			status.textContent = 'Nie udało się pobrać artykułów.';
			console.error('Blog search error:', error);
		}
	};

	let debounceTimer;

	input.addEventListener('input', () => {
		clearTimeout(debounceTimer);

		const query = input.value.trim();

		if (!query) {
			searchPosts('');
			return;
		}

		debounceTimer = setTimeout(() => {
			searchPosts(query);
		}, 300);
	});

	window.addEventListener('popstate', () => {
		const params = new URLSearchParams(window.location.search);

		const query = params.get('search') || '';
		const page = Math.max(1, Number(params.get('search_page')) || 1);

		input.value = query;
		searchPosts(query, page, false);
	});

	const initialParams = new URLSearchParams(window.location.search);

	const initialQuery = initialParams.get('search') || '';
	const initialPage = Math.max(1, Number(initialParams.get('search_page')) || 1);

	if (initialQuery) {
		input.value = initialQuery;
		searchPosts(initialQuery, initialPage, false);
	}
};
