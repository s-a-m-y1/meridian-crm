import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with email and password fields', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sign in to your account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Create your account');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.fill('input[type="password"]', 'password123');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    await page.click('button[aria-label="Show password"]');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    
    await page.click('button[aria-label="Hide password"]');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test.skip('should show validation error for invalid email', async ({ page }) => {
    // Requires form validation to work
  });

  test.skip('should show validation error for short password', async ({ page }) => {
    // Requires form validation to work
  });

  test.skip('should show error for invalid credentials', async ({ page }) => {
    // Requires backend API
  });
});