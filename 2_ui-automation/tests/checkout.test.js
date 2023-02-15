const { test, expect, Page } = require('@playwright/test');
const {
	logInUsernameInput,
	logInPasswordInput,
	logInSubmitButton,
	acceptedUsernames,
  acceptedPassword,
} = require('../pages/LogInPage');
const { username, password, baseUrl } = require('../resources/common');

const priceTagBackpackXpath = "//button[@data-test='add-to-cart-sauce-labs-backpack']/preceding-sibling::div";
const backpackAddToCartBtn = "//button[@data-test='add-to-cart-sauce-labs-backpack']";
let backpackPriceInt;

test.describe.serial('Checkout Sauce Labs Backpack', () => {
	test('Get sauce labs backpack price', async ({ page }) => {
		await page.goto(baseUrl);
		await expect(page.locator(logInUsernameInput)).toBeVisible();
		await expect(page.locator(logInPasswordInput)).toBeVisible();
		await expect(page.locator(logInSubmitButton)).toBeVisible();
		await expect(page.locator(acceptedUsernames)).toBeVisible();
    await expect(page.locator(acceptedPassword)).toBeVisible();

    const usernameText = await page.locator(acceptedUsernames).textContent();
    // const test = await page
		// 	.locator("div > :text('standard_user')")
		// 	.locator(":text('standard_user')")
		// 	.textContent();
    // console.log(test);
    const passwordText = await page.locator(acceptedPassword).textContent();

		await page
			.locator(logInUsernameInput)
			.type(
				usernameText.replace('Accepted usernames are:', '').substring(0, 13)
			);
		await page
			.locator(logInPasswordInput)
			.type(passwordText.replace('Password for all users:', ''));
		await page.locator(logInSubmitButton).click();
		await page.waitForTimeout(5000);

		await expect(page.locator(priceTagBackpackXpath)).toBeVisible();
		await expect(page.locator(backpackAddToCartBtn)).toBeVisible();
		const priceString = await page.locator(priceTagBackpackXpath).textContent();
		backpackPriceInt = parseFloat(priceString.replace('$', ''));
    const response = page.waitForResponse(
			(response) =>
				response.url() ===
					'https://www.saucedemo.com/static/media/sauce-backpack-1200x1500.34e7aa42.jpg' &&
				response.status() === 200
		);
    console.log(await response)
    await page.locator(backpackAddToCartBtn).click();
	});
});
