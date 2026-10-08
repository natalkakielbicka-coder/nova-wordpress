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

export const initBlogSearch = () => {
	const input = document.querySelector('#nova-blog-search');
	const results = document.querySelector('#nova-blog-results');
	const status = document.querySelector('#nova-blog-search-status');
	const pagination = document.querySelector('#nova-blog-pagination');

	if (!input || !results || !status) {
		return;
	}

	const originalContent = results.innerHTML;

	let controller = null;
	let requestId = 0;

	const searchPosts = async (query) => {
		controller?.abort();
		controller = null;

		const currentRequest = ++requestId;

		if (!query.trim()) {
			results.innerHTML = originalContent;
			status.textContent = '';
			if (pagination) pagination.hidden = false;
			return;
		}

		controller = new AbortController();

		status.textContent = 'Wyszukiwanie...';

		if (pagination) pagination.hidden = true;

		const url = new URL('/wp-json/wp/v2/posts', window.location.origin);

		url.searchParams.set('search', query.trim());
		url.searchParams.set('per_page', '9');
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

			if (currentRequest !== requestId) {
				return;
			}

			results.replaceChildren();

			if (!posts.length) {
				status.textContent = 'Nie znaleziono artykułów.';
				return;
			}

			posts.forEach((post) => {
				results.append(createPostCard(post));
			});

			status.textContent = `Znaleziono ${posts.length} artykułów na pierwszej stronie wyników.`;
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
};
