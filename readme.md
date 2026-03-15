Iniciar un proyecto
1) npm init playwright@latest
2) npm install dotenv
3) npm install winston

Instalar playwright-bdd
1) npm i -D playwright-bdd 


**Step 1) Create configuration file**
Create the following playwright.config.ts in the project root:

```
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

Dentro de defineConfig dejar "testDir" solo
export default defineConfig({
    ...
  testDir,
  ...
});
```


**Step 2) Create feature file**
Create a feature file inside feature/xxx.feature:

Feature: Playwright site

    Scenario: Check get started link
        Given I am on home page
        When I click link "Get started"
        Then I see in title "Installation"


**Step 3) Implement steps**
Implement the steps in steps/XXXsteps.js:

```ts
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('Estoy logueado', async ({ page }) => {
  //
});
```
**x)LUEGO PUEDE USARSE ctrl+. en el feature para crear automaticametne los step**
**X) Si no reconoce los steps, ir a la extension de cucuber, a settings y agregar los path de steps y features en "cucumber.features" y "cucumber.glue".**
```
"cucumber.features": [
        "**/*.feature",
       ...
],
"cucumber.glue": [
        "**/features/**/*.ts",
        ....
]
```

**X)PERO ES MEJOR USAR npx bbdgen y sacarlos de la consola, porque asi los crea en el fomrato correcto**

**Step 4) Run tests**
Generate and run the tests:

npx bddgen && npx playwright test


**GENERAR un fixture.ts -> ESTE DEBE ESTAR EN LA MISMA CARPETA DE LOS STEPS PARA NO GENERAR ERRORES**
1. Genrar un fixture.ts para poder inyectar las page a los steps sin probelmas
**Ejemplo**

        import { test as base, createBdd } from 'playwright-bdd';
        import { LoginPage } from '../pageobjects/login-page';
        import { HomePage } from '../pageobjects/home-page';
        import { ProductPage } from '../pageobjects/product-page';
        import { CartPage } from '../pageobjects/cart-page';
        import { CheckoutPage } from '../pageobjects/checkout-page';

        type Fixtures = {
            loginPage: LoginPage;
            homePage: HomePage;
            productPage: ProductPage;
            cartPage: CartPage;
            checkoutPage: CheckoutPage;
        };

        export const test = base.extend<Fixtures>({
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
            }

        });

        export const { Given, When, Then } = createBdd(test);

2. Luego usarlo asi:
    ```
    import { Given, When, Then } from '../../config/fixtures';

    Given('Estoy logueado', async ({ page, loginPage }) => {
      const user: string = process.env.TEST_USER || ""; 
      const pass: string = process.env.TEST_PASS || "";
      const url: string = env.urls.frontend
      log.info('Iniciando el test de compra de productos');
      await loginPage.login(url, user, pass);  
      await loginPage.verifyLoginSuccess();
    });
    ```
**USAR TAGS**
Pueden ponerse tags en los .feauture

    @POM
    Scenario: Compra de productos
        Given Estoy logueado
        When Agrego un producto al carrito
        Then Se completa la compra del productos

    @POM2
    Scenario: Compra de productos
        Given Estoy logueado

Si queremos ejecutarlo usar 
npx bddgen --tags "@POM"; npx playwright test

**FIXTURES UTILES**

    $test and $testInfo
    $step
    $tags

Estos se usan con fixture 
```ts
Given('I do something', async ({ browserName, $test }) => { 
  if (browserName === 'firefox') $test.skip();
  // ...
});
```

ejemplos:
- $test.skip() // Se salta el test
- await $testInfo.attach('producto-en-carrito', {
        body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
        contentType: 'image/png'
    }); //Para SS
- console.log($step.title) //Imprimie el titulo del step
- console.log($tags) //imprime un arrya con los tags
- Overwrite the viewport for scenarios with the @mobile tag:
- EJEMPLO de usar viepoer epsecifico si es @mobile
import { test as base } from 'playwright-bdd';

export const test = base.extend({
  viewport: async ({ $tags, viewport }, use) => {
    if ($tags.includes('@mobile')) {
      viewport = { width: 375, height: 667 };
    }
    await use(viewport);
  }
});


**CUCUMBER REPORT**
reporter: [cucumberReporter('html', { outputFile: 'cucumber-report/index.html', externalAttachments: true, })]

UNa manera mas avanzada, para que CI ocupe blob y normal use rel reprot html de pw, y html y json de cucumber
*externalAttachments permite asociar los trace si estan activados*
reporter: process.env.CI ? 'blob' : [
    ['html'],
    cucumberReporter('html', { outputFile: 'cucumber-report/index.html', externalAttachments: true, }),
    cucumberReporter('json', { outputFile: 'cucumber-report/report.json' })  
  ],

**Merge report con shards**
Cuando ejecutamos por shard hay que mergear, es similar a PW nativo pero se usa este comando
Merge reports (important to pass the --config option pointing to playwright.config.ts):
npx playwright merge-reports --config playwright.config.ts ./blob-report

  
**TODO: REVISAR paginas de HOOKS , aprender como manejarlo**
**TODO: Revisar LA FORMA IDEAL de PASAR DATOS ENTRE ESCENARIOS Y STEPS**


**PASAR DATOS ENTRE STEPS**
- Sep uede usar dentrgo de fixtures un type ctx del tipo que queramos
- El mas simple es Record<string, any>; para usar como cqueramos por emploe usarlo ctx.valor = "aa"

type Ctx = Record<string, any>;

- Tambien puede ser ma estrcto si se require:
type Ctx = {
  newTapPromise: Promise<Page> 
};

- Luego agregarlo a los fixture:
export const test = base.extend<{ ctx: Ctx }>({
  ctx: async ({}, use) => {
    const ctx = {} as Ctx;
    await use(ctx);
  },
});

- Luego se usa:

Given('Estoy logueado', async ({ page, loginPage, ctx}) => {
    ctx.nuevoLoco ="Soy un valor en el contexto";
}


**TODO: SE PUEDEN USAR HOOJS; AHI VEMOS COMO ES; ES SENCILLO ***
**PERO EN VEZ DE HHOKS PEUDE USARSE FIXSTURE + PRJECTS**
**REVISAR EJMEPLO: https://github.com/vitalets/playwright-bdd/blob/main/examples/auth/features/steps/fixtures.ts**
Ese ejemplo usa un setup.ts y lueg o m pw.config.ts pone el prjet
 projects: [
    {
      name: 'auth',
      testDir: 'features/auth',
      testMatch: /setup\.ts/,
    },

  similar a como lo vimos en el tuto de pw norml

  luego ne el fixture se puede jugar, aquo si tien el tag noauth, deja las cookes y origins vacios, si no usa es storage
  export const test = base.extend<Fixtures>({
  storageState: async ({ $tags, storageState }, use) => {
    // reset storage state for features/scenarios with @noauth tag
    if ($tags.includes('@noauth')) {
      storageState = { cookies: [], origins: [] };
    }
    await use(storageState);
  },
});

*** Con Fixsute puede hacer un setup and teardown ***

*La clave esta en el await use(...)*

type Fixtures = {
   ....
    auth: LoginPage;
   ....
};

export const test = base.extend<Fixtures>({
    auth: async ({page}, use) => {
        log.debug("Ejecutando fixture de autenticación");
        const loginPage = new LoginPage(page);
        const user: string = process.env.TEST_USER || "";
        const pass: string = process.env.TEST_PASS || "";
        const url: string = env.urls.frontend
        await loginPage.login(url, user, pass);
        await loginPage.verifyLoginSuccess();
        *await use(loginPage);*
        log.debug('Teardown de auth');
  },
  ....

*Todo En un fixture de Playwright, await use(...) parte el fixture en 2:*
*Antes de await use(...) → setup*
*Después de await use(...) → teardown*




**Para skipear los logs: skipAttachments: ['text/x.cucumber.log+plain']**


**Hacer attach de logs en el reporte teniendo skip los logs fde consolas**
await $testInfo.attach('log-evento', {
       body: "log desde el step de login",
      contentType: 'text/plain',
    }) 

**como publicar en reports.cucumber.io**
1) Generas un archivo .ndjson de Cucumber Messages desde playwright-bdd.
para eso agregar  cucumberReporter('message', { outputFile: 'cucumber-report/messages.ndjson', skipAttachments: ['text/x.cucumber.log+plain'] })  
2) Ir a https://messages.cucumber.io/api/reports
3) Buscar en las repsons headers "Location"
4) Copiar la URL
5) COn postman o automatico hacer un PUT con el archivo .ndjson (en postman debe ir en el body conmo binary)
6. Luego ingesar a la url que se entrega al comienzo (https://reports.cucumber.io/reports/xxxxxx).