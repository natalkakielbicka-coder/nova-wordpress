const createPostCard = (post) => {
	const article = document.createElement('article');
	article.className = 'group min-w-0';

	const link = document.createElement('a');
	link.href = post.link;
	link.className = 'block';

	// Miniaturka wpisu.
	const imageWrapper = document.createElement('div');
	imageWrapper.className = 'aspect-[4/3] overflow-hidden bg-nova-white';

	const media = post._embedded?.['wp:featuredmedia']?.[0];

	if (media?.source_url) {
		const image = document.createElement('img');

		image.src = media.media_details?.sizes?.large?.source_url || media.source_url;

		image.alt = media.alt_text || '';
		image.loading = 'lazy';
		image.decoding = 'async';
		image.className =
			'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]';

		imageWrapper.append(image);
	}

	// Data i kategorie.
	const meta = document.createElement('div');
	meta.className =
		'mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.12em] text-nova-muted';

	const date = document.createElement('time');
	date.dateTime = post.date;
	date.textContent = new Date(post.date).toLocaleDateString('pl-PL');

	meta.append(date);

	const terms = post._embedded?.['wp:term']?.flat() || [];

	const categories = terms
		.filter((term) => term.taxonomy === 'category')
		.map((term) => term.name);

	if (categories.length) {
		const separator = document.createElement('span');
		separator.textContent = '/';
		separator.setAttribute('aria-hidden', 'true');

		const category = document.createElement('span');
		category.textContent = categories.join(', ');

		meta.append(separator, category);
	}

	// Tytuł.
	const title = document.createElement('h2');
	title.className =
		'mt-4 font-serif text-2xl leading-tight text-nova-ink transition group-hover:opacity-60';

	title.textContent = decodeHtml(post.title?.rendered || 'Bez tytułu');

	// Opis.
	const excerpt = document.createElement('p');
	excerpt.className = 'mt-4 line-clamp-3 text-sm leading-7 text-nova-text';

	excerpt.textContent = decodeHtml(post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '');

	// Link.
	const readMore = document.createElement('span');
	readMore.className =
		'mt-6 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm text-nova-ink';

	readMore.textContent = 'Czytaj więcej →';

	link.append(imageWrapper, meta, title, excerpt, readMore);

	article.append(link);

	return article;
};

const decodeHtml = (html) => {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = html;
	return textarea.value;
};

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

	if (!input || !results || !status) {
		return;
	}

	const originalContent = results.innerHTML;

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

		if (query.trim() && page > 1) {
			url.searchParams.set('page', String(page));
		} else {
			url.searchParams.delete('page');
		}

		window.history.pushState({}, '', url);
	};

	const searchPosts = async (query, page = 1) => {
		controller?.abort();
		controller = null;

		const currentRequest = ++requestId;

		if (!query.trim()) {
			results.innerHTML = originalContent;
			status.textContent = '';
			if (pagination) {
				pagination.innerHTML = paginationOriginal;
				pagination.hidden = false;
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

			updateUrl(query, page);

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
		const page = Math.max(1, Number(params.get('page')) || 1);

		input.value = query;
		searchPosts(query, page);
	});
};
