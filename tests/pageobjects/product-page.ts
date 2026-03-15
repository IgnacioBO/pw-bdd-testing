import { expect, Locator, Page } from '@playwright/test';
import { Product } from '../models/product';
import {randomIntFromInterval} from '../utils/generic-functions'

export class ProductPage {
    private readonly page: Page
    private readonly productTitle: Locator
    private readonly productDescription: Locator
    private readonly productPrice: Locator
    private readonly addToCartButton: Locator
    private readonly cartContainer: Locator

    constructor(page: Page) {
        this.page = page
        this.productTitle = page.locator('.inventory_details_name')
        this.productDescription = page.locator('.inventory_details_desc')
        this.productPrice = page.locator('.inventory_details_price')
        this.addToCartButton = page.getByRole('button', { name: 'to cart' })
        this.cartContainer = page.locator('.shopping_cart_link')
    }

    async verifyProductDetails(product: Product) {
        await expect(this.productTitle).toContainText(product.title);
        await expect(this.productDescription).toContainText(product.description);
        await expect(this.productPrice).toContainText(product.price);
    }

    async addToCart() {
        await this.addToCartButton.click();
        await expect(this.cartContainer.locator('.shopping_cart_badge')).toBeVisible();
        await this.cartContainer.click();
    }

}