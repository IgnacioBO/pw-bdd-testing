import { cleanEnv, str, bool } from 'envalid';

export const env = cleanEnv(process.env, {
  COUNTRY: str({ choices: ['cl', 'pe'], default: 'cl' }),
  APP_ENV: str({ choices: ['qa', 'prod'], default: 'qa' }),
  URL: str({ desc: 'URL to saucedemo' }),
  TEST_USER: str({ default: undefined }),
  TEST_PASS: str({ default: undefined }),
  HEADED: bool({ default: true })
});