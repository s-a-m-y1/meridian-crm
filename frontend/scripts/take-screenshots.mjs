#!/usr/bin/env node
/**
 * Take screenshots of the running Meridian CRM frontend for the README.
 *
 * Usage (from frontend/):
 *   node scripts/take-screenshots.mjs [baseUrl] [email] [password]
 *
 * Defaults: http://localhost:3000, demo@meridian.crm / Demo1234!x
 * Saves PNGs to ../docs/screenshots/
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:3000';
const EMAIL = process.argv[3] || 'demo@meridian.crm';
const PASSWORD = process.argv[4] || 'Demo1234!x';
const OUT_DIR = resolve(__dirname, '../../docs/screenshots');

mkdirSync(OUT_DIR, { recursive: true });

const pages = [
  { name: 'dashboard', path: '/dashboard', wait: 3500 },
  { name: 'leads', path: '/leads', wait: 2500 },
  { name: 'activities', path: '/activities', wait: 2500 },
  { name: 'tasks', path: '/tasks', wait: 2500 },
  { name: 'deals', path: '/deals', wait: 2500 },
  { name: 'customers', path: '/customers', wait: 2500 },
  { name: 'properties', path: '/properties', wait: 2500 },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Login page
  console.log('→ login page');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT_DIR}/login.png` });

  // 2. Log in as demo user
  console.log(`→ logging in as ${EMAIL}`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 20000 });
  await page.waitForTimeout(1500);

  // 3. Authenticated pages
  for (const p of pages) {
    console.log(`→ ${p.name} (${p.path})`);
    await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(p.wait);
    await page.screenshot({
      path: `${OUT_DIR}/${p.name}.png`,
      fullPage: p.name === 'dashboard' ? false : false,
    });
  }

  await browser.close();
  console.log(`\n✅ Screenshots saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Screenshot failed:', err.message);
  process.exit(1);
});
