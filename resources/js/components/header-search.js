const decodeHtml = (html) => {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = html;
	return textarea.value;
};

const createSuggestion = (post) => {
	const link = document.createElement('a');
	link.href = post.link;
	link.className =
		'group flex items-center gap-4 border-b border-nova-line py-4 transition hover:opacity-60';

	const imageWrapper = document.createElement('div');
	imageWrapper.className = 'size-16 shrink-0 overflow-hidden bg-nova-white';

	const media = post._embedded?.['wp:featuredmedia']?.[0];

	if (media?.source_url) {
		const image = document.createElement('img');

		image.src = media.media_details?.sizes?.thumbnail?.source_url || media.source_url;
		image.alt = media.alt_text || '';
		image.loading = 'lazy';
		image.className = 'h-full w-full object-cover';

		imageWrapper.append(image);
	}

	const content = document.createElement('div');
	content.className = 'min-w-0 flex-1';

	const title = document.createElement('span');
	title.className = 'block font-serif text-lg text-nova-ink';
	title.textContent = decodeHtml(post.title?.rendered || 'Bez tytułu');

	const terms = post._embedded?.['wp:term']?.flat() || [];
	const categories = terms
		.filter((term) => term.taxonomy === 'category')
		.map((term) => term.name);

	const category = document.createElement('span');
	category.className = 'mt-1 block text-xs uppercase tracking-[0.12em] text-nova-muted';
	category.textContent = categories.join(', ') || 'Artykuł';

	const arrow = document.createElement('span');
	arrow.className = 'text-xl text-nova-ink';
	arrow.textContent = '↗';
	arrow.setAttribute('aria-hidden', 'true');

	content.append(title, category);
	link.append(imageWrapper, content, arrow);

	return link;
};

export const initHeaderSearch = () => {
	const toggle = document.querySelector('#nova-search-toggle');
	const panel = document.querySelector('#nova-search-panel');
	const input = document.querySelector('#nova-live-search-input');
	const results = document.querySelector('#nova-live-search-results');

	if (!toggle || !panel || !input || !results) {
		return;
	}

	let debounceTimer;
	let controller = null;
	let requestId = 0;
	let activeIndex = -1;

	const resetResults = () => {
		activeIndex = -1;
		results.replaceChildren();
		input.setAttribute('aria-expanded', 'false');
	};

	const setOpen = (isOpen, restoreFocus = true) => {
		panel.classList.toggle('hidden', !isOpen);
		toggle.setAttribute('aria-expanded', String(isOpen));
		toggle.setAttribute('aria-label', isOpen ? 'Zamknij wyszukiwarkę' : 'Otwórz wyszukiwarkę');

		if (isOpen) {
			input.focus();
		} else {
			clearTimeout(debounceTimer);
			controller?.abort();
			requestId++;
			resetResults();
			if (restoreFocus) {
				toggle.focus();
			}
		}
	};

	const searchPosts = async (query) => {
		controller?.abort();
		controller = new AbortController();

		const currentRequest = ++requestId;

		results.textContent = 'Wyszukiwanie...';

		const url = new URL('/wp-json/wp/v2/posts', window.location.origin);

		url.searchParams.set('search', query);
		url.searchParams.set('per_page', '5');
		url.searchParams.set('_embed', '1');
		url.searchParams.set('_fields', 'id,link,title,_links,_embedded');

		try {
			const response = await fetch(url, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const posts = await response.json();

			if (currentRequest !== requestId) {
				return;
			}

			resetResults();

			if (!posts.length) {
				results.textContent = 'Nie znaleziono artykułów.';
				return;
			}

			const fragment = document.createDocumentFragment();

			posts.forEach((post) => {
				fragment.append(createSuggestion(post));
			});

			results.append(fragment);

			const allResults = document.createElement('a');

			const searchUrl = new URL('/', window.location.origin);
			searchUrl.searchParams.set('s', query);
			searchUrl.searchParams.set('post_type', 'post');

			allResults.href = searchUrl.toString();
			allResults.className =
				'mt-5 inline-flex items-center gap-2 border-b border-nova-ink pb-1 text-sm font-medium text-nova-ink transition hover:opacity-60';

			allResults.textContent = 'Zobacz wszystkie wyniki →';

			results.append(allResults);

			input.setAttribute('aria-expanded', 'true');
		} catch (error) {
			if (error.name === 'AbortError' || currentRequest !== requestId) {
				return;
			}

			results.textContent = 'Nie udało się pobrać wyników.';
			console.error('Header search error:', error);
		}
	};

	toggle.addEventListener('click', () => {
		const isOpen = toggle.getAttribute('aria-expanded') === 'true';
		setOpen(!isOpen);
	});

	document.addEventListener('pointerdown', (event) => {
		const isOpen = toggle.getAttribute('aria-expanded') === 'true';

		if (!isOpen) {
			return;
		}

		if (!panel.contains(event.target) && !toggle.contains(event.target)) {
			setOpen(false, false);
		}
	});

	const getSuggestions = () => Array.from(results.querySelectorAll('a'));

	const setActiveSuggestion = (index) => {
		const suggestions = getSuggestions();

		if (!suggestions.length) {
			return;
		}

		activeIndex = index;

		suggestions.forEach((link, i) => {
			link.classList.toggle('bg-nova-white', i === activeIndex);
			link.classList.toggle('outline-none', i === activeIndex);
		});

		suggestions[activeIndex]?.scrollIntoView({
			block: 'nearest',
		});
	};

	input.addEventListener('keydown', (event) => {
		const suggestions = getSuggestions();

		if (!suggestions.length) {
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			setActiveSuggestion((activeIndex + 1) % suggestions.length);
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();

			setActiveSuggestion((activeIndex - 1 + suggestions.length) % suggestions.length);
		}

		if (event.key === 'Enter' && activeIndex >= 0) {
			event.preventDefault();

			window.location.assign(suggestions[activeIndex].href);
		}
	});

	input.addEventListener('input', () => {
		clearTimeout(debounceTimer);
		controller?.abort();
		requestId++;

		const query = input.value.trim();

		if (query.length < 2) {
			resetResults();
			return;
		}

		debounceTimer = setTimeout(() => {
			searchPosts(query);
		}, 300);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
			setOpen(false);
		}
	});
};
