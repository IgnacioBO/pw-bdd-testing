// hooks.ts
import { BeforeWorker, AfterWorker, BeforeScenario, BeforeStep, AfterScenario, AfterStep } from './fixtures';
import {log} from '../../../config/logger';

BeforeWorker(async ({ $workerInfo, browser }) => {
  log.info(`Iniciando el worker ${$workerInfo.workerIndex} con el navegador ${browser.browserType().name()}`);
});

AfterWorker(async ({ $workerInfo, browser }) => {
  log.debug(`Finalizando el worker ${$workerInfo.workerIndex} con el navegador ${browser.browserType().name()}`);
});

BeforeScenario(async ({ $testInfo }) => {
  log.info(`Iniciando el escenario: ${$testInfo.title}`);
});

BeforeScenario({ tags: '@POM' },async ({ $testInfo }) => {
  log.info(`Iniciando el escenario SOLO @POM: ${$testInfo.title}`);
});

AfterScenario(async ({ $testInfo }) => {
  log.info(`Finalizando el escenario: ${$testInfo.title}`);
});

BeforeStep(async ({ $step }) => {
  log.debug(`Iniciando el step: ${$step.title}`);
}
);

AfterStep(async ({ $step }) => {
  log.debug(`Finalizando el step: ${$step.title}`);
}
);
