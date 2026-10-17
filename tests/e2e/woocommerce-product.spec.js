import { expect, test } from '@playwright/test';

const productUrl =
	process.env.WOOCOMMERCE_PRODUCT_URL ?? 'http://nauka.local/produkt/cable-organizer-set/';

test('WooCommerce simple product page displays its product details', async ({ page }) => {
	const pageErrors = [];
	page.on('pageerror', (error) => pageErrors.push(error.message));

	await page.goto(productUrl);

	const productName = page.getByRole('heading', { level: 1 });
	await expect(productName).toBeVisible();
	await expect(productName).not.toBeEmpty();

	const price = page.locator('.summary .price').first();
	await expect(price).toBeVisible();
	await expect(price).not.toBeEmpty();

	const addToCartButton = page
		.locator('form.cart')
		.getByRole('button', { name: 'Dodaj do koszyka' });
	await expect(addToCartButton).toBeVisible();
	await expect(addToCartButton).toBeEnabled();

	const mainImage = page.locator('.woocommerce-product-gallery img.wp-post-image').first();
	if ((await mainImage.count()) > 0) {
		await expect(mainImage).toBeVisible();
		await expect
			.poll(() =>
				mainImage.evaluate((image) => image.complete && image.naturalWidth > 0),
			)
			.toBe(true);
	}

	expect(pageErrors).toEqual([]);
});
