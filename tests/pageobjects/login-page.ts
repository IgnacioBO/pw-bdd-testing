import { expect, Locator, Page } from '@playwright/test';
import { log } from '../../config/logger';

export class LoginPage {

    private readonly page: Page;
    private readonly userNameTextBox: Locator;
    private readonly passwordTextBox: Locator;
    private readonly loginButton: Locator;
    private readonly headerText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameTextBox = page.getByRole('textbox', { name: 'Username' });
        this.passwordTextBox = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.headerText = page.locator(".app_logo");
    }

    
    async loginClassic(url: string, user: string, pass: string) {
        await this.page.goto(url);
        await this.userNameTextBox.fill(user);
        await this.passwordTextBox.fill(pass);
        await this.loginButton.click();
    }  

    async login(url: string, user: string, pass: string) {
        await this.goToLoginPage(url);
        await this.fillUserName(user);
        await this.fillPassword(pass);
        await this.clickLoginButton();
    }

    //Meotodos aserciones, algunas las aserciones la hacen directo en la pagia de test.
    async verifyLoginSuccess() {
        await expect(this.headerText).toContainText('Swag Labs');
        log.info('Login exitoso'); 
    }

    //Meotodos privados atomico
    private async goToLoginPage(url: string) {
        await this.page.goto(url);
    }

    private async fillUserName(user: string) {
        await this.userNameTextBox.fill(user);
    }

    private async fillPassword(pass: string) {
        await this.passwordTextBox.fill(pass);
    }

    private async clickLoginButton() {
        await this.loginButton.click();
    }


}