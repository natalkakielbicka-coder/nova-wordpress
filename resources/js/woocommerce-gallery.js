export function initWooCommerceGallery() {
	const galleries = document.querySelectorAll('.woocommerce-product-gallery');

	galleries.forEach((gallery) => {
		const thumbs = gallery.querySelector('.flex-control-thumbs');

		if (!thumbs || thumbs.dataset.novaSlider === 'true') return;

		thumbs.dataset.novaSlider = 'true';

		const wrapper = document.createElement('div');
		wrapper.className = 'nova-gallery-thumbs';

		const createButton = (direction) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = `nova-gallery-thumbs__arrow nova-gallery-thumbs__arrow--${direction}`;
			button.setAttribute(
				'aria-label',
				direction === 'up' ? 'Poprzednie zdjęcia' : 'Następne zdjęcia',
			);

			button.innerHTML =
				direction === 'up'
					? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>'
					: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

			button.addEventListener('click', () => {
				thumbs.scrollBy({
					top: direction === 'up' ? -92 : 92,
					behavior: 'smooth',
				});
			});

			return button;
		};

		const upButton = createButton('up');
		const downButton = createButton('down');

		thumbs.parentNode.insertBefore(wrapper, thumbs);
		wrapper.append(upButton, thumbs, downButton);

		const updateButtons = () => {
			upButton.disabled = thumbs.scrollTop <= 1;
			downButton.disabled = thumbs.scrollTop + thumbs.clientHeight >= thumbs.scrollHeight - 1;
		};

		thumbs.addEventListener('scroll', updateButtons, { passive: true });

		const observer = new ResizeObserver(updateButtons);
		observer.observe(thumbs);

		const mutationObserver = new MutationObserver(updateButtons);
		mutationObserver.observe(thumbs, { childList: true });

		const scrollToActive = () => {
			const active = thumbs.querySelector('img.flex-active');
			if (!active) return;

			active.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest',
			});
		};

		thumbs.addEventListener('click', () => {
			requestAnimationFrame(scrollToActive);
		});

		updateButtons();
	});
}
