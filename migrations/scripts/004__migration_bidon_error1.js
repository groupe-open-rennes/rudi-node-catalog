import { logD } from '../../src/utils/logging.js'

const mod = 'migration_bidon_error1'

export async function migrate({ connection }) {
  const fun = 'migrate'

  logD(mod, fun, 'migrate')
  throw new Error('test error');
}