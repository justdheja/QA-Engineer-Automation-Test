const { test, expect } = require('@playwright/test');
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
const productItemCards = "(//div[@class='inventory_item'])";
let backpackPriceInt;

test.describe.serial('Checkout Sauce Labs Backpack', () => {
	test('Get sauce labs backpack price', async ({ page, request }) => {
		await test.step('Log In', async () => {
			await page.goto(baseUrl);
			await expect(page.locator(logInUsernameInput)).toBeVisible();
			await expect(page.locator(logInPasswordInput)).toBeVisible();
			await expect(page.locator(logInSubmitButton)).toBeVisible();
			await expect(page.locator(acceptedUsernames)).toBeVisible();
			await expect(page.locator(acceptedPassword)).toBeVisible();
			const usernameText = await page.locator(acceptedUsernames).textContent();
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
			await page.waitForTimeout(2500);
		})

		await test.step('Assert Product Cards', async () => {
			const itemCards = page.locator(productItemCards);
			const itemCardCount = await itemCards.count();
			await expect(itemCardCount).toBe(6);
			for (let i = 0; i < itemCardCount; i++) {
				const el = itemCards.nth(i);
				await expect(el).toBeVisible();

				// assert title
				await expect(
					el.locator("//div[@class='inventory_item_description']/div[1]/a")
				).toBeVisible();

				// assert description
				await expect(
					el.locator("//div[@class='inventory_item_description']/div[1]/div")
				).toBeVisible();

				// assert price tag
				await expect(
					el.locator("//div[@class='inventory_item_description']/div[2]/div")
				).toBeVisible();

				// assert add to cart button
				await expect(
					el.locator("//div[@class='inventory_item_description']/div[2]/button")
				).toBeVisible();

				const image = el.locator("//div[@class='inventory_item_img']/a/img");
				const imageUrl = await image.getAttribute('src');
				const response = await request.get(baseUrl + imageUrl);
				expect(response.status()).toBe(200);
			}
		})

		await test.step("Get Backpack's Price", async () => {
			const priceString = await page.locator(priceTagBackpackXpath).textContent();
			backpackPriceInt = parseFloat(priceString.replace('$', ''));
		})

		await page.locator(backpackAddToCartBtn).click();
	});
});
