import { test, expect } from '@playwright/test'

// Skip the first-run onboarding overlay so we land on the main app.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('gogreen-state-v1', JSON.stringify({ onboarded: true }))
  })
})

test('home dashboard renders the impact card', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Your Impact')).toBeVisible()
})

test('bottom nav switches to the scanner', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Scan' }).click()
  await expect(page.getByRole('button', { name: /Scan with Camera/i })).toBeVisible()
})

test('demo product scan shows the dual score', async ({ page }) => {
  await page.goto('/#/scan')
  await page.getByRole('button', { name: /Try demo products/i }).click()
  await page.getByText('Coca-Cola 1.5L').click()
  // Dual score revealed after the scan animation.
  await expect(page.getByText('Health Score', { exact: true })).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Eco Score', { exact: true })).toBeVisible()
})
