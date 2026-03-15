import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../../pageobjects/login-page';
import { HomePage } from '../../pageobjects/home-page';
import { ProductPage } from '../../pageobjects/product-page';
import { CartPage } from '../../pageobjects/cart-page';
import { CheckoutPage } from '../../pageobjects/checkout-page';
import { env } from '../../../config/env';
import { log } from '../../../config/logger';
import { Product } from '../../models/product';

type Ctx = Record<string, any>;
type World = {
    productoRandomSel?: Product;
    grupoDeProductos: Product[];
};

type Fixtures = {
    ctx: Ctx;
    auth: void;
    loginPage: LoginPage;
    homePage: HomePage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    forEachTest: void;
    world: World;
};

type WorkerFixtures = {
    forEachWorker: void;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
    //Fixture de autenticación, se puede usar para loguearse antes de cada test, en este caso se loguea antes de cada test usando las credenciales del .env, y se hace un teardown al finalizar el test.
    //Para usarlo solo basta con poner "auth" dentro de los argumentos del step, y se ejecutara antes de ese step, en este caso se ejecuta antes del step de "Estoy logueado", pero como es un fixture se puede usar en cualquier step y se ejecutara antes de ese step.
    auth: async ({page}, use) => {
        log.debug("Ejecutando fixture de autenticación");
        const loginPage = new LoginPage(page);
        const user: string = process.env.TEST_USER || "";
        const pass: string = process.env.TEST_PASS || "";
        const url: string = env.URL
        await loginPage.login(url, user, pass);
        await loginPage.verifyLoginSuccess();
        await use();
        log.debug('Teardown de auth');
    },
    //Fixture automatico que corre antes de cada test, se puede usar para setup o teardown, en este caso es un ejemplo de setup y teardown automatico.
    forEachTest: [
        async ({ page }, use) => {
            log.debug('Hook automatico before each test');
            await use();
            log.debug(`Last URL: ${page.url()}`);
        },
        { scope:'test', auto: true },
    ],
    //Fixture automatico que corre antes de cada worker, se puede usar para setup o teardown, en este caso es un ejemplo de setup y teardown automatico.
    forEachWorker: [
        async ({}, use) => {
            log.debug('Hook automatico before each worker');
            await use();
            log.debug('Hook automatico after each worker');
        },
        { scope:'worker', auto: true },
    ],
    //Fixtures de contexto, se puede usar para compartir informacion entre steps, por ejemplo en este caso se guarda un valor en el contexto y se muestra en el step de agregar al carrito.
    ctx: async ({}, use) => {
        const ctx: Ctx = {};
        await use(ctx);
    },
    //Fixture de world, es lo mismo que ctx pero con un tipo definido, se puede usar para compartir informacion entre steps, por ejemplo en este caso se guarda el producto random seleccionado y el grupo de productos en el world, para luego usarlos en los siguientes steps.
    world: async ({}, use) => {
        const world: World = {
            productoRandomSel: undefined, //Inicializo el producto random seleccionado como un objeto vacio, pero con el tipo Product, p
            grupoDeProductos: [] as Product[], //Inicializo el grupo de productos como un array vacio, pero con el tipo Product[]
        };
        await use(world);
    },
    //Fixtures de paginas, se crean las instancias de las paginas y se pasan a los steps para que puedan usarlas, esto es parte del patron POM.
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
});

export const { Given, When, Then, BeforeWorker, AfterWorker, BeforeScenario, AfterScenario, BeforeStep, AfterStep } = createBdd(test);
