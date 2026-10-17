import { expect, test } from '@playwright/test';

const pageUrl = process.env.NOVA_TABS_URL ?? 'http://nauka.local/poprawki/';

test('NOVA Tabs activates the selected panel', async ({ page }) => {
	await page.goto(pageUrl);

	const tabs = page.locator('[data-nova-tabs]');
	await expect(tabs).toBeVisible();

	const triggers = tabs.locator('[data-nova-tab-trigger]');
	const triggerCount = await triggers.count();
	expect(triggerCount).toBeGreaterThanOrEqual(2);

	const panels = tabs.locator('[data-nova-tab-panel]');
	await expect(panels).toHaveCount(triggerCount);

	const firstTrigger = triggers.nth(0);
	const secondTrigger = triggers.nth(1);
	const firstPanel = panels.nth(0);
	const secondPanel = panels.nth(1);

	await expect(firstTrigger).toHaveAttribute('aria-selected', 'true');
	await expect(firstPanel).toBeVisible();

	await secondTrigger.click();

	await expect(secondTrigger).toHaveAttribute('aria-selected', 'true');
	await expect(firstTrigger).toHaveAttribute('aria-selected', 'false');
	await expect(firstPanel).toBeHidden();
	await expect(secondPanel).toBeVisible();
});
