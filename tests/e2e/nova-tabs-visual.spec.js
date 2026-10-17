import { expect, test } from '@playwright/test';

const pageUrl = process.env.NOVA_TABS_URL ?? 'http://nauka.local/poprawki/';

test.use({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 1,
	colorScheme: 'light',
	locale: 'pl-PL',
});

test('NOVA Tabs desktop visual regression', async ({ page }) => {
	await page.goto(pageUrl);

	const tabs = page.locator('[data-nova-tabs]:visible').first();
	await expect(tabs).toBeVisible();

	const activeTrigger = tabs.locator('[data-nova-tab-trigger][aria-selected="true"]');
	await expect(activeTrigger).toBeVisible();
	await expect(activeTrigger).toBeEnabled();

	await page.evaluate(() => document.fonts.ready);
	await page.mouse.move(1279, 799);
	await page.addStyleTag({
		content: `
			[data-nova-tabs],
			[data-nova-tabs] * {
				animation: none !important;
				caret-color: transparent !important;
				transition: none !important;
			}
		`,
	});

	await expect(tabs).toHaveScreenshot('nova-tabs-desktop.png', {
		animations: 'disabled',
	});
});
