import {expect, Locator, Page} from '@playwright/test';
import { Product } from '../models/product';
export class CartPage {
    private readonly page: Page;
    private readonly checkoutButton: Locator;
    private readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', {name:'checkout'});
        this.cartItems = page.locator(".cart_item");
    }

    async verifyPageLoaded() {
         await expect(this.checkoutButton).toBeVisible();
    }

    async verifyIfProductInCart(product: Product) {
        for (const cartItem of await this.cartItems.all()) {
            const cartItemTitle = await cartItem.locator('.inventory_item_name').innerText();
            const cartItemDesc = await cartItem.locator('.inventory_item_desc').innerText();
            const cartItemPrice = await cartItem.locator('.inventory_item_price').innerText();
            await expect(cartItemTitle).toContain(product.title);
            await expect(cartItemDesc).toContain(product.description);
            await expect(cartItemPrice).toContain(product.price);
        }
    }
    

    async goToCheckout() {
        await this.checkoutButton.click();
    }

    async screenshotCartItems() {
        await this.cartItems.screenshot({path: 'screenshots/cart-items.png'});
    }

}