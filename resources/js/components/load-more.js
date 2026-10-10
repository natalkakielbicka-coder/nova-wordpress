import { createPostCard } from './post-card';

export const initLoadMore = () => {
	const button = document.querySelector('#nova-load-more');
	const wrapper = document.querySelector('#nova-load-more-wrapper');
	const status = document.querySelector('#nova-load-more-status');
	const results = document.querySelector('#nova-blog-results');
	const pagination = document.querySelector('#nova-blog-pagination');

	if (!button || !wrapper || !results || !status) {
		return;
	}

	if (button.dataset.initialized === 'true') {
		return;
	}

	button.dataset.initialized = 'true';

	let currentPage = Number(button.dataset.page) || 1;
	const maxPages = Number(button.dataset.maxPages) || 1;
	let isLoading = false;

	// Ukrywamy klasyczną paginację, gdy działa Load More.
	if (pagination) {
		pagination.hidden = true;
	}

	const loadPosts = async () => {
		if (isLoading || currentPage >= maxPages) {
			return;
		}

		isLoading = true;
		button.disabled = true;
		button.textContent = 'Ładowanie...';
		status.textContent = '';

		const nextPage = currentPage + 1;

		const url = new URL('/wp-json/wp/v2/posts', window.location.origin);

		url.searchParams.set('page', String(nextPage));
		url.searchParams.set('per_page', '9');
		url.searchParams.set('_embed', '1');
		url.searchParams.set('_fields', 'id,link,title,excerpt,date,reading_time,_links,_embedded');

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const posts = await response.json();

			if (!posts.length) {
				throw new Error('Brak kolejnych wpisów');
			}

			const fragment = document.createDocumentFragment();

			posts.forEach((post) => {
				fragment.append(createPostCard(post));
			});

			results.append(fragment);

			results.dispatchEvent(new CustomEvent('nova:posts-loaded'));

			currentPage = nextPage;

			status.textContent = `Załadowano ${posts.length} kolejnych wpisów.`;

			if (currentPage >= maxPages) {
				button.remove();
				status.textContent = 'Wszystkie wpisy zostały załadowane.';
			}
		} catch (error) {
			status.textContent = 'Nie udało się załadować wpisów. Spróbuj ponownie.';

			console.error('Load More error:', error);
		} finally {
			isLoading = false;

			if (button.isConnected) {
				button.disabled = false;
				button.textContent = 'Załaduj więcej';
			}
		}
	};

	button.addEventListener('click', loadPosts);
};
