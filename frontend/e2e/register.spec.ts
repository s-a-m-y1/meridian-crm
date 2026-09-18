import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display register form with all fields', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create your account');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Create account');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Sign in to your account');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.fill('input[name="password"]', 'password123');
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    await page.click('button[aria-label="Show password"]');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'text');
    
    await page.click('button[aria-label="Hide password"]');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test.skip('should show validation error for short name', async ({ page }) => {
    // Requires form validation to work
  });

  test.skip('should show validation error for invalid email', async ({ page }) => {
    // Requires form validation to work
  });

  test.skip('should show validation error for short password', async ({ page }) => {
    // Requires form validation to work
  });

  test.skip('should show validation error for password mismatch', async ({ page }) => {
    // Requires form validation to work
  });
});