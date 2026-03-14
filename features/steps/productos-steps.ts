import {test, expect, Locator} from '@playwright/test';
import { env } from '../../config/env';
import { Product } from '../../models/product';
import { log } from '../../config/logger';
import { createBdd, DataTable } from 'playwright-bdd';
import { LoginPage } from '../../pageobjects/login-page';

import { Given, When, Then } from './fixtures';

Given('Estoy logueado', async ({ page, loginPage, ctx, auth, $workerInfo}) => {
    ctx.nuevoLoco ="Soy un valor en el contexto";
    log.debug(`Información del worker: ${JSON.stringify($workerInfo.workerIndex)}`);

    const user: string = process.env.TEST_USER || ""; 
    const pass: string = process.env.TEST_PASS || "";
    const url: string = env.urls.frontend
    log.info('Iniciando el test de compra de productos');
    await loginPage.login(url, user, pass);
    await loginPage.verifyLoginSuccess();
    //auth;
});

When('Agrego un producto al carrito', async ({homePage, productPage, cartPage, page, $testInfo, ctx, world}) => {
    log.debug(`Valor en el contexto: ${ctx.nuevoLoco}`);
    world.productoRandomSel = await homePage.clickOneRandomProduct();
    log.debug(`Producto random elegido: ${JSON.stringify(world.productoRandomSel)}`);

    await productPage.verifyProductDetails(world.productoRandomSel);
    await productPage.addToCart();

    await cartPage.verifyPageLoaded();
    await cartPage.verifyIfProductInCart(world.productoRandomSel);
    //Guardar ss en carpeta
    await page.screenshot({path: 'screenshots/product-in-cart.png'});

    //Guardar ss en reporte
    await $testInfo.attach('producto-en-carrito', {
        body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
        contentType: 'image/png'
    });
    await cartPage.screenshotCartItems();
});
            

Then('Se completa la compra del productos', async ({cartPage, checkoutPage, page, world}) => {
  await cartPage.goToCheckout();

  await checkoutPage.fillCheckoutForm('Juan', 'Perez', '12345');
  await checkoutPage.continueCheckoutPt2();
  //SS completa sin scroll
  await page.screenshot({path: 'screenshots/product-in-checkout.png', fullPage: true});
  await checkoutPage.verifyIfProductInCheckout(world.productoRandomSel!);
  await checkoutPage.verifySubTotalPrice(world.productoRandomSel!);
  await checkoutPage.finishCheckout();

  await page.waitForTimeout(1000);
})

Given('Estoy logueado con {string}', async ({loginPage}, arg: string) => {
  log.info(`Iniciando el test de compra de productos con el usuario: ${arg}`);
    const user: string = process.env.TEST_USER || ""; 
    const pass: string = process.env.TEST_PASS || "";
    const url: string = env.urls.frontend
    log.info('Iniciando el test de compra de productos');
    await loginPage.login(url, user, pass);
    await loginPage.verifyLoginSuccess();
});


Given('Tengo una lista de productos', async ({}, dataTable: DataTable) => {
  //Recorreo datatable y los imprimo
console.log(dataTable);
  for (const row of dataTable.raw()) {
    log.info(`Producto: ${row}`);
  }
});
