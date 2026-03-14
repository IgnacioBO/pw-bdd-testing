import {test, expect, Locator} from '@playwright/test';
import { LoginPage } from '../pageobjects/login-page';
import { HomePage } from '../pageobjects/home-page';
import { ProductPage } from '../pageobjects/product-page';
import { CartPage } from '../pageobjects/cart-page';
import { CheckoutPage } from '../pageobjects/checkout-page';
import { env } from '../config/env';
import { Product } from '../models/product';
import { log } from '../config/logger';

test.describe('Feature: Productos', () => {

    //Con este podemos limpoar el staorageState si no quewremo usar el cosntuiod
   // test.use({storageState: {cookies: [], origins: []}}); 

    test('Scenario 1: Compra de productos', {tag: "@POM",
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
},
         async ({page}, testInfo) => {   

        const user: string = process.env.TEST_USER || ""; 
        const pass: string = process.env.TEST_PASS || "";
        const url: string = env.urls.frontend;
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        let productoRandomSel: Product; 

       await test.step('Given Estoy logueado', async () => {
        log.info('Iniciando el test de compra de productos');
         await loginPage.login(url, user, pass); 
            //Se recomienda dejar la asercion separada del metodo de accion asi que
            await loginPage.verifyLoginSuccess();
            //otros literal es hacer la asercion directo en el test, y dejar el metodo de login solo para la accion de login, sin aserciones, y la asercion hacerla aca sin un metodo
            /*const headerText = await page.locator(".app_logo");
            await expect(headerText).toContainText('Swag Labs');*/
        });   
    
        //Aqui el test.step permite devolver un valor que sera el producto random elegido.
        productoRandomSel = await test.step('When Agrego un producto al carrito', async () => {
            let producto = await homePage.clickOneRandomProduct();
            log.debug(`Producto random elegido: ${JSON.stringify(producto)}`);

            await productPage.verifyProductDetails(producto);
            await productPage.addToCart();

            await cartPage.verifyPageLoaded();
            await cartPage.verifyIfProductInCart(producto);
            //Guardar ss en carpeta
            await page.screenshot({path: 'screenshots/product-in-cart.png'});

            //Guardar ss en reporte
            await testInfo.attach('producto-en-carrito', {
                body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
                contentType: 'image/png'
            });
            await cartPage.screenshotCartItems();
            return producto;
        });

        await test.step('Then Se completa la compra del productos', async () => {
            await cartPage.goToCheckout();

            await checkoutPage.fillCheckoutForm('Juan', 'Perez', '12345');
            await checkoutPage.continueCheckoutPt2();
            //SS completa sin scroll
            await page.screenshot({path: 'screenshots/product-in-checkout.png', fullPage: true});
            await checkoutPage.verifyIfProductInCheckout(productoRandomSel);
            await checkoutPage.verifySubTotalPrice(productoRandomSel);
            await checkoutPage.finishCheckout();
            
            await page.waitForTimeout(1000);
        });

    });

        test('Scenario 2: Seleccionar de productos corto con storageState', {tag: "@POM",
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
},
        async ({browser}, testInfo) => { 
        const context = await browser.newContext({
      storageState: './playwright/.auth/user.json',
    });

    const page = await context.newPage();

        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        let productoRandomSel: Product; 

  //     await test.step('Given Estoy logueado', async () => {
   //         await loginPage.login(url, user, pass); 
            //Se recomienda dejar la asercion separada del metodo de accion asi que
   //         await loginPage.verifyLoginSuccess();
            //otros literal es hacer la asercion directo en el test, y dejar el metodo de login solo para la accion de login, sin aserciones, y la asercion hacerla aca sin un metodo
            /*const headerText = await page.locator(".app_logo");
            await expect(headerText).toContainText('Swag Labs');*/
     //   });

     page.goto('https://www.saucedemo.com/inventory.html');
        
    
        //Aqui el test.step permite devolver un valor que sera el producto random elegido.
        productoRandomSel = await test.step('When Agrego un producto al carrito', async () => {
            let producto = await homePage.clickOneRandomProduct();
            console.log(`Producto random elegido: ${JSON.stringify(producto)}`);

            await productPage.verifyProductDetails(producto);
            await productPage.addToCart();

            await cartPage.verifyPageLoaded();
            await cartPage.verifyIfProductInCart(producto);
            //Guardar ss en carpeta
            await page.screenshot({path: 'screenshots/product-in-cart.png'});

            //Guardar ss en reporte
            await testInfo.attach('producto-en-carrito', {
                body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
                contentType: 'image/png'
            });
            await cartPage.screenshotCartItems();
            return producto;
        });

    });

});

test('comprar un producto OLD 2', async ({page}) => {
    
    const user: string = process.env.TEST_USER || ""; 
    const pass: string = process.env.TEST_PASS || "";
    const url: string = env.urls.frontend;
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);


    await loginPage.login(url, user, pass);
    //Se recomienda dejar la asercion separada del metodo de accion asi que
    await loginPage.verifyLoginSuccess();
    //otros literal es hacer la asercion directo en el test, y dejar el metodo de login solo para la accion de login, sin aserciones, y la asercion hacerla aca sin un metodo
    /*const headerText = await page.locator(".app_logo");
    await expect(headerText).toContainText('Swag Labs');*/

    //Obtenemos todos los items de cada producto de la pagina
    //Con el all() obtenemos un array de locators completo
    const productItems = await page.locator("#inventory_container .inventory_item").all();
    console.log(await productItems.length)

    //Elegimos un producto random de la pagina
    const indiceProdRandom: number = randomIntFromInterval(0, (await productItems.length-1));
    console.log(indiceProdRandom);
    const productoRandom = productItems[indiceProdRandom];

    //Obtenemos el titulo, descripcion y precio del producto random elegido, y lo mostramos por consola
    const tituloItem: string = await productoRandom.locator('.inventory_item_name').innerText() ;
    const descItem: string = await productoRandom.locator('.inventory_item_desc').innerText();
    const precioItem = await productoRandom.locator('.inventory_item_price').textContent();
    console.log(`Title: ${tituloItem} \nDescription: ${descItem} \nPrice: ${precioItem}`);
    
    //Hacemos click en el producto random elegido, para ir a su pagina de detalle, y verificamos que el titulo del detalle sea el mismo que el titulo del item random elegido
    await productoRandom.locator('.inventory_item_name').click();
    const tituloItemGrande = await page.locator('.inventory_details_name').textContent();
    console.log(tituloItemGrande);
    await expect(tituloItemGrande).toContain(tituloItem);

    //Agregamos el producto al carrito, verificamos que el badge del carrito se muestre, hacemos click en el badge del carrito
    await page.getByRole('button', {name:'cart'}).click();
    await expect(await page.locator('.shopping_cart_badge')).toBeVisible();
    await page.locator('.shopping_cart_badge').click();

    await expect(page.getByRole('button', {name:'checkout'})).toBeVisible();

   //Verificamos que el titulo del item agregado al carrito sea el mismo que el titulo del item random elegido, de manera global (toma todos los items y ve si contiene)
    const cartItems = await page.locator(".cart_item");
    await expect(cartItems).toContainText(tituloItem);

    //Verificacion una por una
    for (const cartItem of await cartItems.all()) {
        const cartItemTitle = await cartItem.locator('.inventory_item_name').innerText();
        const cartItemDesc = await cartItem.locator('.inventory_item_desc').innerText();
        const cartItemPrice = await cartItem.locator('.inventory_item_price').innerText();
        await expect(cartItemTitle).toContain(tituloItem);
        await expect(cartItemDesc).toContain(descItem);
        await expect(cartItemPrice).toContain(precioItem);

        console.log(`***Title: ${cartItemTitle}|Description: ${cartItemDesc}|Price: ${cartItemPrice}***`);
    }


    //Checkout
    await page.getByRole('button', {name:'checkout'}).click();
    await page.getByRole('textbox', {name:'First Name'}).fill('Juan');
    await page.getByRole('textbox', {name:'Last Name'}).fill('Perez');
    await page.getByRole('textbox', {name:'Postal Code'}).fill('12345');

    //Checkout pt 2
    await page.getByRole('button', {name:'Continue'}).click();
    await page.waitForLoadState('load');
    //Verificamos que el item en el checjout este ok
    const checkoutItems = await page.locator(".cart_item");
    for (const cartItem of await cartItems.all()) {
        const cartItemTitle = await cartItem.locator('.inventory_item_name').innerText();
        const cartItemDesc = await cartItem.locator('.inventory_item_desc').innerText();
        const cartItemPrice = await cartItem.locator('.inventory_item_price').innerText();
        await expect(cartItemTitle).toContain(tituloItem);
        await expect(cartItemDesc).toContain(descItem);
        await expect(cartItemPrice).toContain(precioItem);
        //console.log(`***Title: ${cartItemTitle}|Description: ${cartItemDesc}|Price: ${cartItemPrice}***`);
    }

    const subTotalPrice = await page.locator('.summary_subtotal_label').innerText();
    console.log(subTotalPrice);

    //Checkout pt 3
    page.getByRole('button', {name:'Finish'}).click();
    await expect(page.getByRole('heading', {name:'Thank you for your order!'})).toHaveText('Thank you for your order!');



    await page.waitForTimeout(1000);



});

test('comprar un producto OLD', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    const user: string = 'standard_user';
    const pass: string = 'secret_sauce'

    await page.getByRole('textbox', {name: 'Username'}).fill(user);
    await page.getByRole('textbox', {name: 'Password'}).fill(pass);
    await page.getByRole('button', {name: 'Login'}).click();

    //Verificamos el titulo correcto
    const headerText = await page.locator(".app_logo");
    await expect(headerText).toContainText('Swag Labs');

    //Obtenemos todos los items de cada producto de la pagina
    //Con el all() obtenemos un array de locators completo
    const productItems = await page.locator("#inventory_container .inventory_item").all();
    console.log(await productItems.length)

    //Elegimos un producto random de la pagina
    const indiceProdRandom: number = randomIntFromInterval(0, (await productItems.length-1));
    console.log(indiceProdRandom);
    const productoRandom = productItems[indiceProdRandom];

    //Obtenemos el titulo, descripcion y precio del producto random elegido, y lo mostramos por consola
    const tituloItem: string = await productoRandom.locator('.inventory_item_name').innerText() ;
    const descItem: string = await productoRandom.locator('.inventory_item_desc').innerText();
    const precioItem = await productoRandom.locator('.inventory_item_price').textContent();
    console.log(`Title: ${tituloItem} \nDescription: ${descItem} \nPrice: ${precioItem}`);
    
    //Hacemos click en el producto random elegido, para ir a su pagina de detalle, y verificamos que el titulo del detalle sea el mismo que el titulo del item random elegido
    await productoRandom.locator('.inventory_item_name').click();
    const tituloItemGrande = await page.locator('.inventory_details_name').textContent();
    console.log(tituloItemGrande);
    await expect(tituloItemGrande).toContain(tituloItem);

    //Agregamos el producto al carrito, verificamos que el badge del carrito se muestre, hacemos click en el badge del carrito
    await page.getByRole('button', {name:'cart'}).click();
    await expect(await page.locator('.shopping_cart_badge')).toBeVisible();
    await page.locator('.shopping_cart_badge').click();

    await expect(page.getByRole('button', {name:'checkout'})).toBeVisible();

   //Verificamos que el titulo del item agregado al carrito sea el mismo que el titulo del item random elegido, de manera global (toma todos los items y ve si contiene)
    const cartItems = await page.locator(".cart_item");
    await expect(cartItems).toContainText(tituloItem);

    //Verificacion una por una
    for (const cartItem of await cartItems.all()) {
        const cartItemTitle = await cartItem.locator('.inventory_item_name').innerText();
        const cartItemDesc = await cartItem.locator('.inventory_item_desc').innerText();
        const cartItemPrice = await cartItem.locator('.inventory_item_price').innerText();
        await expect(cartItemTitle).toContain(tituloItem);
        await expect(cartItemDesc).toContain(descItem);
        await expect(cartItemPrice).toContain(precioItem);

        console.log(`***Title: ${cartItemTitle}|Description: ${cartItemDesc}|Price: ${cartItemPrice}***`);
    }


    //Checkout
    await page.getByRole('button', {name:'checkout'}).click();
    await page.getByRole('textbox', {name:'First Name'}).fill('Juan');
    await page.getByRole('textbox', {name:'Last Name'}).fill('Perez');
    await page.getByRole('textbox', {name:'Postal Code'}).fill('12345');

    //Checkout pt 2
    await page.getByRole('button', {name:'Continue'}).click();
    await page.waitForLoadState('load');
    //Verificamos que el item en el checjout este ok
    const checkoutItems = await page.locator(".cart_item");
    for (const cartItem of await cartItems.all()) {
        const cartItemTitle = await cartItem.locator('.inventory_item_name').innerText();
        const cartItemDesc = await cartItem.locator('.inventory_item_desc').innerText();
        const cartItemPrice = await cartItem.locator('.inventory_item_price').innerText();
        await expect(cartItemTitle).toContain(tituloItem);
        await expect(cartItemDesc).toContain(descItem);
        await expect(cartItemPrice).toContain(precioItem);
        //console.log(`***Title: ${cartItemTitle}|Description: ${cartItemDesc}|Price: ${cartItemPrice}***`);
    }

    const subTotalPrice = await page.locator('.summary_subtotal_label').innerText();
    console.log(subTotalPrice);

    //Checkout pt 3
    page.getByRole('button', {name:'Finish'}).click();
    await expect(page.getByRole('heading', {name:'Thank you for your order!'})).toHaveText('Thank you for your order!');



    await page.waitForTimeout(1000);


    ///// Test agregando otro item al carrito desde la pagina de detalle del producto, y verificando que ambos items esten en el carrito
    /*await page.getByRole('button', {name:'Go back Continue Shopping'}).click();

    const itemAClickear2: number = randomIntFromInterval(0, (await productItems.length-1));
    console.log(itemAClickear2);
    await productItems[itemAClickear2].getByRole('button', {name:'cart'}).click();


    await page.locator('.shopping_cart_badge').click();
    //console.log((await cartItems.allInnerTexts()).toString());
    await expect((await cartItems.allInnerTexts()).toString()).toContain(tituloItem);
    for (const cartItem of await cartItems.all()) {
        const cartItemTitle = await cartItem.locator('.inventory_item_name').textContent();
        const cartItemDesc = await cartItem.locator('.inventory_item_desc').textContent();
        const cartItemPrice = await cartItem.locator('.inventory_item_price').textContent();
        console.log(`***Title: ${cartItemTitle}|Description: ${cartItemDesc}|Price: ${cartItemPrice}***`);
    }*/
    ////

});



function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}