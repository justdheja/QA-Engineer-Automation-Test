const { test, expect } = require('@playwright/test');
const { LogIn } = require('../pages/LogInPage');

test.describe('LogIn', async() => {
  await test('get username', async ({ page }) => {
    await LogIn(page)
  })
})