import { test, expect } from '@playwright/test';

test('NOVA Stats animates counters on scroll', async ({ page }) => {
	await page.goto('http://nauka.local/poprawki/');

	const counter = page
		.locator('.wp-block-nova-stats[data-stats-animate="true"]')
		.first()
		.locator('[data-stats-counter]')
		.first();

	await expect(counter).toBeAttached();

	// Obserwujemy zmiany tekstu jeszcze przed przewinięciem.
	const result = await counter.evaluate(async (element) => {
		const values = new Set([element.textContent.trim()]);

		const observer = new MutationObserver(() => {
			values.add(element.textContent.trim());
		});

		observer.observe(element, {
			childList: true,
			characterData: true,
			subtree: true,
		});

		element.scrollIntoView({
			block: 'center',
		});

		await new Promise((resolve) => {
			setTimeout(resolve, 2200);
		});

		observer.disconnect();

		return [...values];
	});

	console.log('Zaobserwowane wartości:', result);

	// Liczba powinna zmienić się w trakcie animacji.
	expect(result.length).toBeGreaterThan(2);

	// Ostatnia wartość powinna być docelowa.
	expect(result.at(-1)).toBe('104%');
});

test('NOVA Stats respects reduced motion', async ({ page }) => {
	await page.emulateMedia({
		reducedMotion: 'reduce',
	});

	await page.goto('http://nauka.local/poprawki/');

	const counter = page
		.locator('.wp-block-nova-stats[data-stats-animate="true"]')
		.first()
		.locator('[data-stats-counter]')
		.first();

	await expect(counter).toBeVisible();

	const result = await counter.evaluate(async (element) => {
		const values = new Set([element.textContent.trim()]);

		const observer = new MutationObserver(() => {
			values.add(element.textContent.trim());
		});

		observer.observe(element, {
			childList: true,
			characterData: true,
			subtree: true,
		});

		element.scrollIntoView({
			block: 'center',
		});

		await new Promise((resolve) => {
			setTimeout(resolve, 1800);
		});

		observer.disconnect();

		return [...values];
	});

	console.log('Reduced motion:', result);

	// Żadna zmiana wartości nie powinna wystąpić.
	expect(result).toEqual(['104%']);
});
