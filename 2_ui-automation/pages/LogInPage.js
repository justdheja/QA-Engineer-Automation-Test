import { baseUrl, password, username } from '../resources/common';

export const logInUsernameInput = "//input[@data-test='username']";
export const logInPasswordInput = "//input[@data-test='password']";
export const logInSubmitButton = "//input[@data-test='login-button']";
export const acceptedUsernames = "//div[@id='login_credentials']";
export const acceptedPassword = "//div[@id='login_credentials']/following-sibling::div";

export const LogIn = async (page) => {
	await page.goto(baseUrl);
	await page.waitForSelector(logInUsernameInput);
	await page.locator(logInUsernameInput).type(username);
	await page.waitForSelector(logInPasswordInput);
	await page.locator(logInPasswordInput).type(password);
	await page.waitForSelector(logInSubmitButton);
	await page.locator(logInSubmitButton).click();
	await page.waitForTimeout(5000);
};
