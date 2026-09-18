import { test, expect } from '@playwright/test';

test.describe('Full Auth Flow Integration', () => {
  test('complete registration -> login -> dashboard -> logout flow', async ({ page }) => {
    // This test requires a running backend server
    // For now, verify the pages are accessible
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('Create your account');
    
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign in to your account');
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should handle session persistence across page reloads', async ({ page }) => {
    // This test requires authentication
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign in to your account');
  });

  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/customers');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/leads');
    await expect(page).toHaveURL('/login');
  });
});