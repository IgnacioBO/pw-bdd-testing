import { defineConfig, devices } from '@playwright/test';
import { cucumberReporter, defineBddConfig } from 'playwright-bdd';

//Configuración para BDD, se le indica el archivo de features y el de steps
const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
  //importTestFrom: './config/fixtures'
});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
 import dotenv from 'dotenv';
 import path from 'path';

 //Constantes, primero es el env y el segundo el pais
 const envir = process.env.APP_ENV ?? 'qa'; 
 const country = process.env.COUNTRY ?? 'cl';
 const headed = process.env.HEADED === 'false' ? false : true;
 //Aqui leera el archivo que se defina al ejecutar (por ejemplo .env.qa.cl o .env.prod.pe) // APP_ENV=qa COUNTRY=cl npx playwright test
 dotenv.config({ path: path.resolve(__dirname, `.env.${envir}.${country}`) });
 //Se cargan .local para variables sensibles 
 dotenv.config({ path: path.resolve(__dirname, `.env.${envir}.${country}.local`), override: true }); 
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'blob' : [
    ['html'],
    cucumberReporter('html', { outputFile: 'cucumber-report/index.html', externalAttachments: true, }),
    cucumberReporter('json', { outputFile: 'cucumber-report/report.json' })  
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: !headed,
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
/*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
*/
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
