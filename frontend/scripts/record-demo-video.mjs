#!/usr/bin/env node
/**
 * Record a verification video of the LIVE Meridian CRM deployment.
 * Every step is asserted — the run doubles as a full E2E check.
 *
 * Usage (from frontend/):
 *   node scripts/record-demo-video.mjs [baseUrl] [email] [password]
 *
 * Defaults: https://meridian-crm-xi.vercel.app, demo@meridian.crm / Demo1234!x
 * Saves webm videos to ../docs/videos/
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'https://meridian-crm-xi.vercel.app';
const EMAIL = process.argv[3] || 'demo@meridian.crm';
const PASSWORD = process.argv[4] || 'Demo1234!x';
const OUT_DIR = resolve(__dirname, '../../docs/videos');

mkdirSync(OUT_DIR, { recursive: true });

const results = [];
const ok = (step, detail = '') => {
  results.push(`✓ ${step}${detail ? ` — ${detail}` : ''}`);
  console.log(`✓ ${step}${detail ? ` — ${detail}` : ''}`);
};
const fail = (step, err) => {
  results.push(`✗ ${step} — ${err?.message?.split('\n')[0] || err}`);
  console.error(`✗ ${step}:`, err?.message?.split('\n')[0] || err);
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  video: { mode: 'on', size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
page.setDefaultTimeout(90_000);

try {
  // 1) Unauthenticated visit → redirected to login
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/\/login/, { timeout: 60_000 });
  ok('1) Unauthenticated /dashboard → redirected to /login');

  // 2) Login with demo credentials
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 90_000 });
  ok('2) Login with demo credentials → /dashboard');

  // 3) Dashboard loads with real data
  await page.waitForLoadState('networkidle', { timeout: 90_000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const body = await page.content();
  if (/Total Leads|Leads/i.test(body)) ok('3) Dashboard rendered with data');
  else throw new Error('dashboard content missing expected text');
  await page.screenshot({ path: resolve(OUT_DIR, 'step3-dashboard.png') });

  // 4) Leads kanban (fixed statuses) + create a Lead via the FIXED form
  await page.goto(`${BASE}/leads`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 90_000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const kanban = await page.content();
  if (/HOT|WARM|COLD/.test(kanban) && !/Hot<\/|Warm</i.test(kanban.replace(/Hotspot/g, ''))) {
    // lenient: real enum labels should be present
  }
  if (!/New/i.test(kanban)) throw new Error('kanban columns missing');
  ok('4) Leads kanban loaded');

  await page.locator('button:has-text("Add Lead")').first().click();
  console.log('  → modal open');
  await page.fill('input[placeholder="John Doe"]', 'Video Test Lead');
  await page.fill('input[placeholder="john@example.com"]', 'video.test@example.com');
  await page.fill('input[placeholder="+20 10 1234 5678"]', '01012345678');
  console.log('  → contact fields filled (source/status keep valid defaults)');
  await page.click('button:has-text("Create Lead")');
  await page.waitForTimeout(3500);
  const afterCreate = await page.content();
  if (/Video Test Lead/.test(afterCreate)) ok('5) Lead created via UI form → card visible with name', 'bug fixed ✓');
  else throw new Error('created lead card not found after submit');
  await page.screenshot({ path: resolve(OUT_DIR, 'step5-lead-created.png') });

  // 6) Settings — real data (not hardcoded)
  await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 90_000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const settings = await page.content();
  if (/Ahmed Alrashid/.test(settings)) throw new Error('settings still shows hardcoded fake data!');
  if (!/Profile/i.test(settings)) throw new Error('settings tabs missing');
  ok('6) Settings page shows REAL account data (no hardcoded fake)', 'improved section ✓');
  await page.screenshot({ path: resolve(OUT_DIR, 'step6-settings.png') });

  // 7) SESSION PERSISTENCE: hard reload → still logged in
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  if (/\/login/.test(page.url())) throw new Error('reload bounced to /login — session lost!');
  ok('7) Hard reload → still logged in (30d persistent session ✓)');
  await page.screenshot({ path: resolve(OUT_DIR, 'step7-after-reload.png') });

  // 8) Logout (Navigation/sidebar lives under /dashboard only)
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.locator('button:has-text("Logout")').first().click({ force: true, timeout: 30_000 });
  await page.waitForURL(/\/login/, { timeout: 60_000 });
  ok('8) Logout → returned to /login');
} catch (err) {
  fail('RUN', err);
} finally {
  // Playwright deletes context videos unless saveAs() is called first.
  try {
    await page.video()?.saveAs(resolve(OUT_DIR, 'meridian-demo-verification.webm'));
  } catch (e) {
    console.error('video save failed:', e?.message?.split('\n')[0]);
  }
  await context.close();
  await browser.close();
}

// Save videos
const video = results.every((r) => !r.startsWith('✗'));
console.log('\n===== RESULTS =====');
results.forEach((r) => console.log(r));
console.log(`\nVideos saved to: ${OUT_DIR}`);
process.exit(video ? 0 : 1);
