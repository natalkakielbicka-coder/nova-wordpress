import { test, expect } from '@playwright/test';

test('NOVA Stats animates counters on scroll', async ({ page }) => {
	await page.goto('http://nauka.local/poprawki/');

	const block = page.locator('.wp-block-nova-stats[data-stats-animate="true"]').first();

	await expect(block).toBeVisible();

	const counter = block.locator('[data-stats-counter]').first();

	await counter.scrollIntoViewIfNeeded();

	// Czekamy na zakończenie animacji.
	await expect
		.poll(
			async () => {
				const value = (await counter.textContent()).trim();
				return value;
			},
			{
				timeout: 5000,
			},
		)
		.toBe('104%');
});

test('NOVA Stats respects reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await page.goto('http://nauka.local/poprawki/');

	const block = page.locator('.wp-block-nova-stats[data-stats-animate="true"]').first();

	await expect(block).toBeVisible();

	const counter = block.locator('[data-stats-counter]').first();

	const originalValue = (await counter.textContent()).trim();

	await counter.scrollIntoViewIfNeeded();

	await expect(counter).toHaveText(originalValue);
});
