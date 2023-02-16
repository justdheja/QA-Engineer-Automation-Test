const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const {
	logInUsernameInput,
	logInPasswordInput,
	logInSubmitButton,
	acceptedUsernames,
	acceptedPassword,
} = require('../pages/LogInPage');
const { username, password, baseUrl } = require('../resources/common');

const priceTagBackpackXpath =
	"//button[@data-test='add-to-cart-sauce-labs-backpack']/preceding-sibling::div";
const backpackAddToCartBtn =
	"//button[@data-test='add-to-cart-sauce-labs-backpack']";
const productItemCards = "(//div[@class='inventory_item'])";
const cartButton = "//div[@id='shopping_cart_container']//a[1]";
const cartPriceTag = "//div[@class='inventory_item_price']";
const checkoutButton = "//button[@data-test='checkout']";

const inputFirstNameCheckout = "//input[@data-test='firstName']";
const inputLastNameCheckout = "//input[@data-test='lastName']";
const inputZipCodeCheckout = "//input[@data-test='postalCode']";
const buttonContinueCheckout = "//input[@data-test='continue']";
const buttonFinishCheckout = "//button[@data-test='finish']";

const thankYouPageTitle = "//div[@id='checkout_complete_container']/h2";
const thankYouPageDesc = "//div[@id='checkout_complete_container']/div";
const thankYouPageImage = "//div[@id='checkout_complete_container']/img";
const thankYouPageButton = "//button[@data-test='back-to-products']";

const randomFirstName = faker.name.firstName();
const randomLastName = faker.name.lastName();
const randomZipCode = faker.address.zipCode();

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
		});

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
		});

		await test.step("Get Backpack's Price", async () => {
			const priceString = await page
				.locator(priceTagBackpackXpath)
				.textContent();
			backpackPriceInt = parseFloat(priceString.replace('$', ''));
		});

		await test.step('Checkout Backpack and Compare Price', async () => {
			await page.locator(backpackAddToCartBtn).click();
			await page.locator(cartButton).click();
			const backpackPriceCart = await page.locator(cartPriceTag).textContent();
			expect(parseFloat(backpackPriceCart.replace('$', ''))).toBe(
				backpackPriceInt
			);
		});

		await test.step('Continue Checkout Process', async () => {
			await expect(page.locator(checkoutButton)).toBeVisible();
			await page.locator(checkoutButton).click();

			await expect(page.locator(inputFirstNameCheckout)).toBeVisible();
			await expect(page.locator(inputLastNameCheckout)).toBeVisible();
			await expect(page.locator(inputZipCodeCheckout)).toBeVisible();
			await expect(page.locator(buttonContinueCheckout)).toBeVisible();

			await page.locator(inputFirstNameCheckout).type(randomFirstName);
			await page.locator(inputLastNameCheckout).type(randomLastName);
			await page.locator(inputZipCodeCheckout).type(randomZipCode);
			await page.locator(buttonContinueCheckout).click();

			const backpackPriceCart = await page.locator(cartPriceTag).textContent();
			expect(parseFloat(backpackPriceCart.replace('$', ''))).toBe(
				backpackPriceInt
			);
			await expect(page.locator(buttonFinishCheckout)).toBeVisible();
			await page.locator(buttonFinishCheckout).click();
			
			expect(await page.locator(thankYouPageTitle).textContent()).toBe(
				'THANK YOU FOR YOUR ORDER'
			);
			expect(await page.locator(thankYouPageDesc).textContent()).toBe(
				'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
			);
			const thankYouImageUrl = await page.locator(thankYouPageImage).getAttribute("src")
			const response = await request.get(baseUrl + thankYouImageUrl)
			expect(response.status()).toBe(200)
			await expect(page.locator(thankYouPageButton)).toBeVisible();
			await page.locator(thankYouPageButton).click();
		});
	});
});
