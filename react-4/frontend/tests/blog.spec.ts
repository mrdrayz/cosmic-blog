import { test, expect } from '@playwright/test';

test.describe('Blog Platform', () => {
  test('home page renders title and search bar', async ({ page }) => {
    await page.goto('/');

    const title = page.getByRole('heading', { name: 'Cosmic Blog' });
    await expect(title).toBeVisible();

    const searchInput = page.getByPlaceholder('Search articles...');
    await expect(searchInput).toBeVisible();

    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible();
  });

  test('login page renders form with email and password fields', async ({ page }) => {
    await page.goto('/login');

    const title = page.getByRole('heading', { name: 'Login' });
    await expect(title).toBeVisible();

    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toBeVisible();

    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('register page renders form with name, email and password fields', async ({ page }) => {
    await page.goto('/register');

    const title = page.getByRole('heading', { name: 'Register' });
    await expect(title).toBeVisible();

    const nameInput = page.getByLabel('Name');
    await expect(nameInput).toBeVisible();

    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeVisible();
  });

  test('navigation from login page to register page works', async ({ page }) => {
    await page.goto('/login');

    const switchButton = page.getByRole('button', { name: /register/i });
    await switchButton.click();

    await expect(page).toHaveURL('/register');

    const title = page.getByRole('heading', { name: 'Register' });
    await expect(title).toBeVisible();
  });

  test('navigation from register page to login page works', async ({ page }) => {
    await page.goto('/register');

    const switchButton = page.getByRole('button', { name: /login/i });
    await switchButton.click();

    await expect(page).toHaveURL('/login');

    const title = page.getByRole('heading', { name: 'Login' });
    await expect(title).toBeVisible();
  });

  test('header contains logo and login link when not authenticated', async ({ page }) => {
    await page.goto('/');

    const logo = page.getByTestId('header-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('Cosmic Blog');

    const loginLink = page.getByRole('link', { name: 'Login' });
    await expect(loginLink).toBeVisible();
  });

  test('actuator API endpoint returns OK', async ({ request }) => {
    const response = await request.get('/api/actuator');

    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('OK');
  });

  test('search bar accepts input and submits', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search articles...');
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');

    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click();

    await expect(searchInput).toHaveValue('test query');
  });

  test('login shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel('Email');
    await emailInput.fill('invalid@test.com');

    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('wrongpassword');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await loginButton.click();

    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('profile page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/profile');

    await expect(page).toHaveURL('/login');
  });
});
