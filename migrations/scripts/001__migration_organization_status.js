const mod = 'migration_organizations_status'

import { logD, logE, logI, logT } from '../../src/utils/logging.js'

import mongoose from 'mongoose'
import fs from 'fs/promises'
import path from 'path'
import Organization from '../../src/definitions/models/Organization.js'
import { getDbFullUri } from '../../src/config/confSystem.js'

const BACKUP_DIR = './migrations/backups'
const MONGODB_URI = getDbFullUri()

async function createBackup(organizations) {
  const fun = 'createBackup'
  logT(mod, fun)

  const timestamp = new Date().toISOString().replace(/[:\.]/g, '-')
  const backupPath = path.join(BACKUP_DIR, `organizations_backup_${timestamp}.json`)

  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
    await fs.writeFile(backupPath, JSON.stringify(organizations, null, 2))
    logD(mod, fun, `✓ Sauvegarde créée avec succès: ${backupPath}`)
    return backupPath
  } catch (error) {
    logE(mod, fun, '❌ Erreur lors de la création de la sauvegarde:', error)
    throw error
  }
}

async function rollback(backupPath) {
  const fun = 'rollback'
  try {
    logD(mod, fun, '🔄 Début du rollback...')
    const backupData = JSON.parse(await fs.readFile(backupPath, 'utf8'))

    for (const org of backupData) {
      // eslint-disable-next-line no-await-in-loop
      await Organization.findByIdAndUpdate(org._id, {
        organization_status: org.organization_status,
        linked_producer_status: org.linked_producer_status,
      })
    }
    logD(mod, fun, '✓ Rollback effectué avec succès')
  } catch (error) {
    logE(mod, fun, '❌ Erreur lors du rollback:', error)
    throw error
  }
}

export async function migrate() {
  const fun = 'migrateOrganizations'
  logT(mod, fun)

  let backupPath
  let successCount = 0
  let errorCount = 0
  const errors = []

  try {
    logI(mod, fun, `MongoDB URI: ${MONGODB_URI}`)
    await mongoose.connect(MONGODB_URI)
    logD(mod, fun, '✓ Connecté à MongoDB')

    const organizations = await Organization.find({})

    // Création de la sauvegarde
    backupPath = await createBackup(organizations)

    // Récupération des organisations à mettre à jour
    const organizationsToUpdate = await Organization.find({
      $or: [
        { organization_status: { $exists: false } },
        {
          organization_status: 'VALIDATED',
          linked_producer_status: { $exists: false },
        },
      ],
    })

    logI(mod, fun, `📊 Nombre d'organisations à mettre à jour: ${organizationsToUpdate.length}`)

    // Mise à jour des organisations
    for (const org of organizationsToUpdate) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await Organization.findByIdAndUpdate(org._id, {
          organization_status: 'VALIDATED',
          linked_producer_status: 'VALIDATED',
        })
        successCount++
      } catch (error) {
        errorCount++
        errors.push({
          organizationId: org._id,
          error: error.message,
        })
      }
    }

    // Rapport final
    logI(mod, fun, '\n📝 Rapport de migration:')
    logI(mod, fun, `✓ Organisations mises à jour avec succès: ${successCount}`)
    logI(mod, fun, `❌ Échecs: ${errorCount}`)

    if (errors.length > 0) {
      logI(mod, fun, '\n❌ Détail des erreurs:')
      errors.forEach((err) => {
        logI(mod, fun, `- Organization ${err.organizationId}: ${err.error}`)
      })
    }
  } catch (error) {
    logE(mod, fun, '❌ Erreur générale lors de la migration:', error)
    if (backupPath) {
      logE(mod, fun, '🔄 Tentative de rollback...')
      await rollback(backupPath)
    }
  } finally {
    await mongoose.connection.close()
  }
}
