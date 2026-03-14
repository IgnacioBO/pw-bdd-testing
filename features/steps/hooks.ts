// hooks.ts
import { BeforeWorker } from './fixtures';
import {log} from '../../config/logger';

BeforeWorker(async ({ $workerInfo, browser }) => {
  log.info(`Iniciando el worker ${$workerInfo.workerIndex} con el navegador ${browser.browserType().name()}`);
});