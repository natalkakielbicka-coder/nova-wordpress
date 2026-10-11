export function initProductCardButtons() {
	if (!window.jQuery) return;

	const $ = window.jQuery;

	$(document.body).on('added_to_cart', (event, fragments, cartHash, button) => {
		if (!button) return;

		const element = $(button)[0];

		if (!element?.closest('.nova-product-card__actions')) return;

		const originalText = element.dataset.originalText || element.textContent.trim();

		element.dataset.originalText = originalText;
		element.textContent = 'Dodano ✓';

		clearTimeout(element.novaResetTimeout);

		element.novaResetTimeout = setTimeout(() => {
			element.textContent = originalText;
		}, 2000);
	});
}
