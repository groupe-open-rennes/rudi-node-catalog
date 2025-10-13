import { logD } from '../../src/utils/logging.js'

const mod = 'migration_bidon2'

export async function migrate({ connection }) {
  const fun = 'migrate'

  logD(mod, fun, 'migrate')
}