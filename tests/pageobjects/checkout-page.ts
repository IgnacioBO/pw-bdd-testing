import { expect, Locator, Page } from '@playwright/test';
import { Product } from '../models/product';

export class CheckoutPage {
    private readonly page: Page;
    private readonly firstNameTextBox: Locator;
    private readonly lastNameTextBox: Locator;
    private readonly postalCodeTextBox: Locator;
    private readonly continueButton: Locator;
    private readonly checkoutItems: Locator;
    private readonly subTotalLabel: Locator;
    private readonly finishButton: Locator
    private readonly orderConfirmationLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameTextBox = page.getByRole('textbox', {name:'First Name'});
        this.lastNameTextBox = page.getByRole('textbox', {name:'Last Name'});
        this.postalCodeTextBox = page.getByRole('textbox', {name:'Postal Code'});
        this.continueButton = page.getByRole('button', {name:'Continue'});
        this.checkoutItems = page.locator(".cart_item");
        this.subTotalLabel = page.locator('.summary_subtotal_label');
        this.finishButton = page.getByRole('button', {name:'Finish'});
        this.orderConfirmationLabel = page.getByRole('heading', {name:'Thank you for your order!'});
    }

    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameTextBox.fill(firstName);
        await this.lastNameTextBox.fill(lastName);
        await this.postalCodeTextBox.fill(postalCode);
    }

    async continueCheckoutPt2() {
        await this.continueButton.click();
        await this.page.waitForLoadState('load');
    }

    async verifyIfProductInCheckout(product: Product) {
        for (const checkoutItem of await this.checkoutItems.all()) {
            const cartItemTitle = await checkoutItem.locator('.inventory_item_name').innerText();
            const cartItemDesc = await checkoutItem.locator('.inventory_item_desc').innerText();
            const cartItemPrice = await checkoutItem.locator('.inventory_item_price').innerText();
            expect(cartItemTitle).toContain(product.title);
            expect(cartItemDesc).toContain(product.description);
            expect(cartItemPrice).toContain(product.price);
        }
    }

    async verifySubTotalPrice(product: Product) {
        const subTotalPrice = await this.subTotalLabel.innerText();
        expect(subTotalPrice, `Expected subtotal to contain the product price: ${product.price}`).toContain(product.price);
    }

    async finishCheckout() {
        await this.finishButton.click();
        await expect(this.orderConfirmationLabel).toHaveText('Thank you for your order!');
    }   


}
