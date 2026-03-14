import { expect, Locator, Page } from '@playwright/test';
import { Product } from '../models/product';
import {randomIntFromInterval} from '../utils/generic-functions'

export class HomePage {
    private readonly page: Page;
    private readonly productItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productItems = page.locator("#inventory_container .inventory_item");
    }

    async clickOneRandomProduct(): Promise<Product> {
        const indiceProdRandom: number = randomIntFromInterval(0, (await this.productItems.count()-1));
        const productoRandom = this.productItems.nth(indiceProdRandom);

        let producto: Product = await this.getProductFromCard(productoRandom);
        await productoRandom.locator('.inventory_item_name').click();
        return producto;
    }

    private async getProductFromCard(productCard: Locator): Promise<Product> {
    return {
        title: await productCard.locator('.inventory_item_name').innerText(),
        description: await productCard.locator('.inventory_item_desc').innerText(),
        price: await productCard.locator('.inventory_item_price').innerText(),
        };
    }


}