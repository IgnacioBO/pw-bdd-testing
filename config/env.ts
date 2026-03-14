export const env = {
  country: getEnv('COUNTRY'),
  appEnv: getEnv('APP_ENV'),

  urls: {
    frontend: getEnv('URL'),
  },

  credentials: {
    test_user: getEnv('TEST_USER'),
    test_pass: getEnv('TEST_PASS'),
  }
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}