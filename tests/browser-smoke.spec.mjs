import { test, expect } from '@playwright/test';

function usesDrawer(testInfo) {
  return !/desktop/i.test(testInfo.project.name);
}

async function expectNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));
  expect.soft(overflow.scrollWidth, `${label}: document horizontal overflow`).toBeLessThanOrEqual(overflow.clientWidth + 1);
  expect.soft(overflow.bodyScrollWidth, `${label}: body horizontal overflow`).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function startFirstTurn(page) {
  await page.locator('#newGame').click();
  await page.locator('#startGame').click();
  await page.locator('#beginTurn').click();
}

test.describe('public v2.2 acceptance', () => {
  test('homepage presents the current identity and navigation remains operable', async ({ page }, testInfo) => {
    await page.goto('/home.html');

    await expect(page).toHaveTitle(/DECISIONS, DECISIONS/);
    await expect(page.locator('.hero-wordmark')).toHaveText(/DECISIONS,DECISIONS/);
    await expect(page.locator('.hero-descriptor')).toHaveText('ONE PROMPT. THREE WAYS TO PLAY.');
    await expect(page.locator('.site-header .brand')).toHaveText('DECISIONS, DECISIONS');
    await expect(page.locator('body')).not.toContainText('GET THE POINT');
    await expectNoHorizontalOverflow(page, 'home');

    if (usesDrawer(testInfo)) {
      const toggle = page.locator('.site-menu-toggle');
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();

      const drawer = page.locator('[data-site-drawer]');
      await expect(drawer).toHaveClass(/is-open/);
      await expect(drawer).toHaveAttribute('aria-hidden', 'false');
      await expect(page.locator('main')).toHaveAttribute('inert', '');
      await expect(drawer.locator('a[href="/playtest"]')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(drawer).not.toHaveClass(/is-open/);
      await expect(drawer).toHaveAttribute('aria-hidden', 'true');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('main')).not.toHaveAttribute('inert', '');
    } else {
      await expect(page.locator('.site-nav-primary')).toBeVisible();
      const more = page.locator('.site-more');
      await more.locator('summary').click();
      await expect(more).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(more).not.toHaveAttribute('open', '');
    }
  });

  test('public decision demo commits one route, records choice time, and resets cleanly', async ({ page }) => {
    await page.goto('/home.html#try');
    const card = page.locator('[data-teaser-card]');
    const hum = page.locator('[data-route="hum"]');
    const draw = page.locator('[data-route="draw"]');
    const next = page.locator('[data-teaser-next]');

    await expect(page.locator('[data-teaser-prompt]')).toHaveText('VOLCANO');
    await expect(page.locator('[data-teaser-question]')).toContainText('HUM — 3 points');
    await expect(next).toHaveText('New prompt');

    await hum.click();

    await expect(card).toHaveClass(/is-committed/);
    await expect(card).toHaveAttribute('data-selected-route', 'hum');
    await expect(card).toHaveAttribute('data-choice-ms', /\d+/);
    await expect(hum).toHaveAttribute('aria-pressed', 'true');
    await expect(draw).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[data-teaser-status]')).toContainText('LOCKED IN · GET THEM TO GUESS');
    await expect(next).toHaveText('Next prompt');

    await next.click();
    await expect(page.locator('[data-teaser-prompt]')).toHaveText('SNEEZE');
    await expect(page.locator('[data-teaser-question]')).toContainText('DRAW — 3 points');
    await expect(card).not.toHaveClass(/is-committed/);
    await expect(card).not.toHaveAttribute('data-selected-route', /.+/);
    await expect(hum).toHaveAttribute('aria-pressed', 'false');
    await expect(next).toHaveText('New prompt');
  });

  test('public decision demo supports keyboard route navigation', async ({ page }) => {
    await page.goto('/home.html#try');
    const hum = page.locator('[data-route="hum"]');
    const draw = page.locator('[data-route="draw"]');
    const mime = page.locator('[data-route="mime"]');

    await hum.focus();
    await page.keyboard.press('ArrowRight');
    await expect(draw).toBeFocused();
    await page.keyboard.press('End');
    await expect(mime).toBeFocused();
    await page.keyboard.press('Home');
    await expect(hum).toBeFocused();
  });

  test('core public pages retain current v2.2 copy and no horizontal overflow', async ({ page }) => {
    for (const [path, heading] of [
      ['/how.html', 'SEE THE PROMPT. WEIGH THE POINTS. PICK YOUR MOVE.'],
      ['/playtest.html', 'PLAY IT COLD. TELL US WHAT HAPPENS.'],
      ['/faq.html', 'THE SHORT ANSWERS FIRST.'],
      ['/about.html', 'THE INTERESTING PART HAPPENS BEFORE THE CLUE.']
    ]) {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText(heading);
      await expect(page.locator('.site-header .brand')).toHaveText('DECISIONS, DECISIONS');
      await expect(page.locator('body')).not.toContainText('GET THE POINT');
      await expectNoHorizontalOverflow(page, path);
    }
  });

  test('playtest recruitment is touch-sized and explains evidence/privacy', async ({ page }) => {
    await page.goto('/playtest.html#signup');
    const name = page.locator('#pt-name');
    const email = page.locator('#pt-email');
    const submit = page.locator('form[name="playtest-interest"] button[type="submit"]');

    await expect(name).toBeVisible();
    await expect(email).toBeVisible();
    await expect(page.locator('body')).toContainText('time spent choosing');
    await expect(page.locator('body')).toContainText('does not require camera or microphone access');

    const sizes = await Promise.all([name, email, submit].map(async locator => {
      const box = await locator.boundingBox();
      return box?.height || 0;
    }));
    for (const height of sizes) expect.soft(height).toBeGreaterThanOrEqual(44);
  });

  test('feedback surface preserves Decision Tension evidence field', async ({ page }) => {
    await page.goto('/feedback.html');
    await expect(page.locator('[name="decision_tension"]')).toBeVisible();
    await expect(page.locator('[name="points_influenced_choice"]')).toBeVisible();
    await expect(page.locator('[name="replay_interest"]')).toBeVisible();
    await expect(page.locator('[name="session_validity"]')).toBeVisible();
  });
});

test.describe('private game static-browser acceptance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play.html');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  test('PWA home → setup → handoff → first prompt remains reachable', async ({ page }) => {
    await expect(page).toHaveTitle(/DECISIONS, DECISIONS/);
    await expect(page.locator('#newGame')).toBeVisible();
    await expect(page.locator('.home-brand h1.brand')).toHaveAttribute('aria-label', 'DECISIONS, DECISIONS');
    await expect(page.locator('.home-screen')).toContainText('PRIVATE PLAYTEST');

    await page.locator('#newGame').click();
    await expect(page.locator('#startGame')).toBeVisible();

    const startBox = await page.locator('#startGame').boundingBox();
    expect.soft(startBox?.height || 0).toBeGreaterThanOrEqual(52);

    await page.locator('#startGame').click();
    await expect(page.locator('#beginTurn')).toBeVisible();
    await page.locator('#beginTurn').click();
    await expect(page.locator('.prompt-card')).toBeVisible();
    await expect(page.locator('.method')).toHaveCount(3);
  });

  test('one tap commits a route and Correct remains the visible canonical fallback', async ({ page }) => {
    await startFirstTurn(page);

    await page.locator('.method').first().click();
    await expect(page.locator('.game--perform .prompt-card')).toBeVisible();
    await expect(page.locator('#correct')).toBeVisible();
    await expect(page.locator('.swipe-hint')).toContainText(/Swipe right/i);

    const correctBox = await page.locator('#correct').boundingBox();
    expect.soft(correctBox?.height || 0).toBeGreaterThanOrEqual(52);
  });

  test('phone viewport keeps the three choice controls on-screen', async ({ page }, testInfo) => {
    test.skip(!/iphone/i.test(testInfo.project.name), 'phone-only geometry check');

    await startFirstTurn(page);
    const methods = page.locator('.method');
    await expect(methods).toHaveCount(3);

    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    for (let i = 0; i < 3; i += 1) {
      const box = await methods.nth(i).boundingBox();
      expect.soft(box?.y || 0).toBeGreaterThanOrEqual(0);
      expect.soft((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual((viewport?.height || 0) + 1);
      expect.soft(box?.height || 0).toBeGreaterThanOrEqual(72);
    }
  });
});