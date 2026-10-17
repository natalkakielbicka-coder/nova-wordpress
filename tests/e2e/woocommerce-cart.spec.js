import { expect, test } from '@playwright/test';

const productUrl =
	process.env.WOOCOMMERCE_PRODUCT_URL ?? 'http://nauka.local/produkt/cable-organizer-set/';

test('WooCommerce adds one product to the cart and removes it', async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const miniCart = page.locator('.wc-block-mini-cart');
	const miniCartButton = miniCart.getByRole('button');
	const drawer = page.locator('.wc-block-mini-cart__drawer');

	try {
		await page.goto(productUrl);

		await expect(miniCartButton).toHaveAttribute('aria-label', 'Liczba pozycji w koszyku: 0');
		await miniCartButton.click();
		await expect(drawer).toHaveAttribute('aria-hidden', 'false');
		await expect(drawer.getByText('Twój koszyk jest obecnie pusty!')).toBeVisible();

		await page.goto(productUrl);
		await page
			.locator('form.cart')
			.getByRole('button', { name: 'Dodaj do koszyka' })
			.click();

		await expect(page.locator('.woocommerce-message')).toBeVisible();
		await expect(miniCartButton).toHaveAttribute('aria-label', 'Liczba pozycji w koszyku: 1');
		await expect(miniCart.locator('.wc-block-mini-cart__badge')).toHaveText('1');

		await miniCartButton.click();
		await expect(drawer).toHaveAttribute('aria-hidden', 'false');

		const cartRow = drawer.locator('.wc-block-cart-items__row');
		await expect(cartRow).toHaveCount(1);
		await expect(cartRow.getByRole('link', { name: 'Cable Organizer Set' })).toBeVisible();
		await expect(cartRow.locator('.wc-block-components-quantity-selector__input')).toHaveValue('1');

		await cartRow.locator('.wc-block-cart-item__remove-link').click();
		await expect(cartRow).toHaveCount(0);
		await expect(drawer.getByText('Twój koszyk jest obecnie pusty!')).toBeVisible();
		await expect(miniCartButton).toHaveAttribute('aria-label', 'Liczba pozycji w koszyku: 0');
	} finally {
		if (!(await page.isClosed())) {
			const removeButton = drawer.locator('.wc-block-cart-item__remove-link').first();

			if ((await removeButton.count()) > 0) {
				if ((await drawer.getAttribute('aria-hidden')) === 'true') {
					await miniCartButton.click();
					await expect(drawer).toHaveAttribute('aria-hidden', 'false');
				}

				await removeButton.click();
				await expect(drawer.locator('.wc-block-cart-items__row')).toHaveCount(0);
			}
		}

		await context.close();
	}
});
