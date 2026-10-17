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

test('NOVA Tabs supports keyboard navigation', async ({ page }) => {
	await page.goto(pageUrl);

	const tabs = page.locator('[data-nova-tabs]');
	await expect(tabs).toBeVisible();

	const triggers = tabs.locator('[data-nova-tab-trigger]');
	const triggerCount = await triggers.count();
	expect(triggerCount).toBeGreaterThanOrEqual(2);

	const panels = tabs.locator('[data-nova-tab-panel]');
	await expect(panels).toHaveCount(triggerCount);

	const expectActiveTab = async (activeIndex) => {
		for (let index = 0; index < triggerCount; index += 1) {
			const trigger = triggers.nth(index);
			const panel = panels.nth(index);
			const isActive = index === activeIndex;

			await expect(trigger).toHaveAttribute('aria-selected', String(isActive));
			await expect(trigger).toHaveAttribute('tabindex', isActive ? '0' : '-1');
			await expect(panel)[isActive ? 'toBeVisible' : 'toBeHidden']();
		}

		await expect(triggers.nth(activeIndex)).toBeFocused();
	};

	await triggers.nth(0).focus();
	await expectActiveTab(0);

	await triggers.nth(0).press('ArrowRight');
	await expectActiveTab(1);

	await triggers.nth(1).press('ArrowRight');
	await expectActiveTab(0);

	await triggers.nth(0).press('ArrowLeft');
	await expectActiveTab(triggerCount - 1);

	await triggers.nth(triggerCount - 1).press('ArrowLeft');
	await expectActiveTab(triggerCount - 2);

	await triggers.nth(triggerCount - 2).press('Home');
	await expectActiveTab(0);

	await triggers.nth(0).press('End');
	await expectActiveTab(triggerCount - 1);
});
